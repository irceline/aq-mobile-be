import './boundary-canvas';

import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DatasetApiInterface, ParameterFilter, Phenomenon, Platform, SettingsService, Station } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions, MapCache } from '@helgoland/map';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';
import {
  BoundaryCanvasOptions,
  circleMarker,
  CircleMarker,
  Control,
  DomUtil,
  geoJSON,
  latLngBounds,
  LatLngExpression,
  Layer,
  popup,
  tileLayer,
} from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import moment from 'moment';
import { forkJoin } from 'rxjs';

import {
  MarkerSelectorGenerator,
} from '../components/customized-station-map-selector/customized-station-map-selector.component';
import { DrawerState } from '../components/overlay-info-drawer/overlay-info-drawer';
import { getIDForMainPhenomenon, MainPhenomenon } from '../model/phenomenon';
import { AnnualMeanService } from '../services/annual-mean/annual-mean.service';
import { IrcelineSettingsService } from '../services/irceline-settings/irceline-settings.service';
import { MapDataService } from '../services/map-data/map-data.service';
import { MobileSettings } from '../services/settings/settings.service';

enum PhenomenonLabel {
  BelAQI = 'BelAQI',
  NO2 = 'NO2',
  O3 = 'O3',
  PM10 = 'PM10',
  PM25 = 'PM25',
  BC = 'BC'
}

enum TimeLabel {
  current = 'current',
  today = 'today',
  tomorrow = 'tomorrow',
  today2 = 'today2',
  today3 = 'today3'
}

enum MeanLabel {
  hourly = 'hourly',
  daily = '24hour',
  yearly = 'yearly'
}

const phenomenonMapping = [
  {
    label: PhenomenonLabel.BelAQI,
    legendId: 'index'
  }, {
    id: getIDForMainPhenomenon(MainPhenomenon.NO2),
    label: PhenomenonLabel.NO2,
    legendId: 'no2_hmean'
  }, {
    id: getIDForMainPhenomenon(MainPhenomenon.O3),
    label: PhenomenonLabel.O3,
    legendId: 'o3_hmean'
  }, {
    id: getIDForMainPhenomenon(MainPhenomenon.PM10),
    label: PhenomenonLabel.PM10,
    legendId: 'pm10_hmean'
  }, {
    id: getIDForMainPhenomenon(MainPhenomenon.PM25),
    label: PhenomenonLabel.PM25,
    legendId: 'pm25_hmean'
  }, {
    id: getIDForMainPhenomenon(MainPhenomenon.BC),
    label: PhenomenonLabel.BC,
    legendId: 'bc_hmean'
  }
];

@Component({
  selector: 'map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  dockedHeight = 92;
  drawerState = DrawerState.Docked;
  states = DrawerState;

  public statusIntervalDuration: number;
  public geoSearchOptions: GeoSearchOptions;
  public phenomenonLabel: PhenomenonLabel;
  public time: TimeLabel = TimeLabel.current;
  public timeAsNumber: number;

  public providerUrl: string;
  public loading: boolean;
  public phenomenonFilter: ParameterFilter;
  public avoidZoomToSelection = true;
  public zoomControlOptions: L.Control.ZoomOptions = {};
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public fitBounds: L.LatLngBoundsExpression;
  public clusterStations: boolean;
  public selectedPhenomenonId: string;
  public selectedPhenomenonLabel: string;
  public nextStationPopup: L.Popup;
  public userLocationPopup: L.Popup;
  public disabled: boolean;
  public markerSelectorGenerator: MarkerSelectorGenerator;

  public mean: string;
  public meanAsNumber: number;
  public show24hourMean = true;
  public showYearlyMean = true;
  public disableMeans: boolean;

  public legend: L.Control;
  private legendVisible = false;

  public mapId = 'map';

  //TODO: Actually set those values
  public loading_colors = [true, true, true, true, true, true];
  public borderColor = ["", "", "", "", "", ""]

  constructor(
    protected settingsSrvc: SettingsService<MobileSettings>,
    protected mapCache: MapCache,
    protected modalCtrl: ModalController,
    protected ircelineSettings: IrcelineSettingsService,
    protected api: DatasetApiInterface,
    protected cdr: ChangeDetectorRef,
    protected translateSrvc: TranslateService,
    protected http: HttpClient,
    protected cacheService: CacheService,
    protected annualProvider: AnnualMeanService,
    protected mapDataService: MapDataService
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.providerUrl = settings.datasetApis[0].url;
    this.clusterStations = settings.clusterStationsOnMap;
    this.statusIntervalDuration = settings.colorizedMarkerForLastMilliseconds;
    this.markerSelectorGenerator = new MarkerSelectorGeneratorImpl(this.mapCache, this.mapId);

    this.setGeosearchOptions(settings);
    this.translateSrvc.onLangChange.subscribe(() => this.setGeosearchOptions);
  }

  public ionViewDidEnter() {
    if (this.mapDataService.selection) {
      const phenId = this.mapDataService.selection.phenomenonID;
      this.selectedPhenomenonId = this.mapDataService.selection.phenomenonID;
      this.phenomenonLabel = this.getPhenomenonLabel(phenId);
      this.adjustMeanUI();
      if (this.mapDataService.selection.yearly) {
        this.mean = MeanLabel.yearly;
      } else {
        this.mean = MeanLabel.hourly;
        /*         switch (this.selectedPhenomenonId) {
                  case getIDForMainPhenomenon(MainPhenomenon.BC):
                  case getIDForMainPhenomenon(MainPhenomenon.NO2):
                  case getIDForMainPhenomenon(MainPhenomenon.O3):
                    break;
                  case getIDForMainPhenomenon(MainPhenomenon.PM10):
                  case getIDForMainPhenomenon(MainPhenomenon.PM25):
                    this.mean = MeanLabel.daily;
                    break;
                } */
      }
    } else {
      this.phenomenonLabel = PhenomenonLabel.BelAQI;
      this.show24hourMean = false;
      this.showYearlyMean = false;
      this.mean = MeanLabel.hourly;
      this.clearSelectedPhenomenon();
    }
    this.removePopups();
    this.zoomToLocation();
    this.adjustUI();
  }

  private removePopups() {
    if (this.nextStationPopup) { this.nextStationPopup.remove(); }
    if (this.userLocationPopup) { this.userLocationPopup.remove(); }
  }

  public mapInitialized(mapId: string) {
    this.updateLegend();
    this.zoomToLocation();
    if (this.mapCache.hasMap(this.mapId)) {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider: provider,
        autoComplete: false
      });
      this.mapCache.getMap(this.mapId).addControl(searchControl);
    }
  }

  public onPhenomenonChange(): void {
    if (this.nextStationPopup) { this.nextStationPopup.remove(); }
    const phenID = this.getPhenomenonID(this.phenomenonLabel);
    if (phenID) {
      this.getPhenomenonFromAPI(phenID);
      this.selectedPhenomenonId = phenID;
    } else {
      this.clearSelectedPhenomenon();
    }
    if (this.phenomenonLabel === PhenomenonLabel.BC) {
      this.time = TimeLabel.current;
    }
    if (this.legendVisible) { this.legendVisible = false; }
    this.adjustMeanUI();
    this.adjustUI();
  }

  public onTimeChange() {
    this.time = TimeLabel[TimeLabel[this.timeAsNumber]];
    switch (this.timeAsNumber) {
      case 0: this.time = TimeLabel.current;
        break;
      case 1: this.time = TimeLabel.today;
        break;
      case 2: this.time = TimeLabel.tomorrow;
        break;
      case 3: this.time = TimeLabel.today2;
        break;
      case 4: this.time = TimeLabel.today3;
        break;
    }
    this.adjustMeanUI();
    this.adjustUI();
  }

  public onMeanChange() {
    switch(this.meanAsNumber) {
      case 1: this.mean = MeanLabel.hourly
      break;
      case 2: this.mean = MeanLabel.daily
      break;
      case 3: this.mean = MeanLabel.yearly
      break;
    }
    this.adjustUI();
  }

  public onStationSelected(platform: Platform) {
    // const modal = this.modalCtrl.create(StationSelectorComponent,
    //   {
    //     platform,
    //     providerUrl: this.providerUrl,
    //     phenomenonId: this.selectedPhenomenonId
    //   }
    // );
    // modal.onDidDismiss(data => { if (data) { this.navCtrl.push(DiagramPage) } });
    // modal.present();
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

  private setGeosearchOptions(settings: MobileSettings) {
    this.geoSearchOptions = { countrycodes: settings.geoSearchCountryCodes, acceptLanguage: this.translateSrvc.currentLang };
  }

  private zoomToLocation() {
    if (this.mapCache.hasMap(this.mapId)) {
      const map = this.mapCache.getMap(this.mapId);
      const selection = this.mapDataService.selection;
      if (selection) {
        const location = { lat: selection.userlocation.latitude, lng: selection.userlocation.longitude } as LatLngExpression;
        const label = selection.userlocation.type === 'user'
          ? this.translateSrvc.instant('map.configured-location') : this.translateSrvc.instant('map.current-location');
        this.userLocationPopup = popup({ autoPan: false })
          .setLatLng(location)
          .setContent(label);
        map.addLayer(this.userLocationPopup);
        const bounds = latLngBounds(location, location);

        if (selection.stationlocation) {
          const station = { lat: selection.stationlocation.latitude, lng: selection.stationlocation.longitude } as LatLngExpression;
          this.nextStationPopup = popup({ autoPan: false })
            .setLatLng(station)
            .setContent(this.translateSrvc.instant('map.nearest-station'));
          map.addLayer(this.nextStationPopup);
          bounds.extend(station);
        }

        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 12 });
      } else {
        map.fitBounds(this.settingsSrvc.getSettings().defaultBbox);
      }
    }
  }

  private updateLegend() {
    if (this.legend) {
      this.legend.remove();
    }
    if (this.mapCache.hasMap(this.mapId)) {

      this.legend = new Control({ position: 'topright' });

      this.legend.onAdd = () => {
        const div = DomUtil.create('div', 'leaflet-bar legend');
        div.innerHTML = this.getLegendContent();
        div.onclick = () => this.toggleLegend(div);
        return div;
      };
      this.legend.addTo(this.mapCache.getMap(this.mapId));
    }
  }

  private toggleLegend(div: HTMLElement) {
    this.legendVisible = !this.legendVisible;
    div.innerHTML = this.getLegendContent();
    const moreLink = DomUtil.get('annual-more-link');
    if (moreLink) {
      moreLink.onclick = (event) => {
        // this.iab.create(this.translate.instant('annual-map.legend.link-more-url'), '_system', 'hidden=yes');
        event.stopPropagation();
      };
    }
  }

  private getLegendContent(): string {
    if (this.legendVisible) {
      const langCode = this.translateSrvc.currentLang.toLocaleUpperCase();
      const legendId = this.getPhenomenonLegendId(this.phenomenonLabel);
      if (legendId) {
        return `<img src="http://www.irceline.be/air/legend/${legendId}_${langCode}.svg">`;
      } else {
        return `<div>${this.translateSrvc.instant('map.no-legend')}</div>`;
      }
    }
    return '<a class="info" role="button"><ion-icon name="information-circle"></ion-icon></a>';
  }

  private clearSelectedPhenomenon() {
    this.selectedPhenomenonId = null;
    this.selectedPhenomenonLabel = null;
  }

  private disabledTimeForBC() {
    this.disabled = this.phenomenonLabel === PhenomenonLabel.BC;
  }

  private getPhenomenonID(label: PhenomenonLabel): string {
    const phen = phenomenonMapping.find(e => label === e.label);
    if (phen) { return phen.id; }
  }

  private getPhenomenonLabel(id: string): PhenomenonLabel {
    const phen = phenomenonMapping.find(e => id === e.id);
    if (phen) { return phen.label; }
  }

  private getPhenomenonLegendId(phenLabel: PhenomenonLabel): string {
    const phen = phenomenonMapping.find(e => phenLabel === e.label);
    if (phen && phen.legendId) { return phen.legendId; }
  }

  private getPhenomenonFromAPI(phenId: string) {
    this.api.getPhenomenon(phenId, this.providerUrl).subscribe(
      phenomenon => this.setPhenomenon(phenomenon),
      error => {
        this.clearSelectedPhenomenon();
        this.phenomenonLabel = this.getPhenomenonLabel(phenId);
      }
    );
  }

  private setPhenomenon(selectedPhenomenon: Phenomenon) {
    this.selectedPhenomenonLabel = selectedPhenomenon.label;
  }

  private adjustUI() {
    // set filter for stations, show on current time and hourly mean only
    if (this.time === TimeLabel.current && this.mean === MeanLabel.hourly) {
      this.phenomenonFilter = { phenomenon: this.selectedPhenomenonId };
    } else {
      this.phenomenonFilter = { phenomenon: '' };
    }
    this.disabledTimeForBC();
    this.adjustLayer();
  }

  private adjustLayer() {
    const request = this.http.get('./assets/multipolygon.json');
    this.cacheService.loadFromObservable('multipolygon', request, null, 60 * 60 * 24).subscribe((geojson: GeoJSON.GeoJsonObject) => {
      this.overlayMaps = new Map<string, LayerOptions>();
      let layerId: string;
      let wmsUrl: string;
      let timeParam: string;
      if (this.time === TimeLabel.current) {
        forkJoin(
          this.annualProvider.getYear(),
          this.ircelineSettings.getSettings(false)
        ).subscribe(result => {
          wmsUrl = 'http://geo.irceline.be/rioifdm/wms';
          const lastUpdate = result[1].lastupdate.toISOString();
          const year = result[0];
          switch (this.phenomenonLabel) {
            case PhenomenonLabel.BelAQI:
              this.drawLayer(wmsUrl, 'belaqi', geojson, lastUpdate);
              break;
            case PhenomenonLabel.BC:
              if (this.mean === MeanLabel.hourly) { this.drawLayer(wmsUrl, 'bc_hmean', geojson, lastUpdate); }
              if (this.mean === MeanLabel.yearly) { this.drawLayer(wmsUrl, `bc_anmean_${year}_atmostreet`, geojson); }
              break;
            case PhenomenonLabel.NO2:
              if (this.mean === MeanLabel.hourly) { this.drawLayer(wmsUrl, 'no2_hmean', geojson, lastUpdate); }
              if (this.mean === MeanLabel.yearly) { this.drawLayer(wmsUrl, `no2_anmean_${year}_atmostreet`, geojson); }
              break;
            case PhenomenonLabel.O3:
              if (this.mean === MeanLabel.hourly) { this.drawLayer(wmsUrl, 'o3_hmean', geojson, lastUpdate); }
              break;
            case PhenomenonLabel.PM10:
              if (this.mean === MeanLabel.hourly) { this.drawLayer(wmsUrl, 'pm10_hmean', geojson, lastUpdate); }
              if (this.mean === MeanLabel.daily) { this.drawLayer(wmsUrl, 'pm10_24hmean', geojson, lastUpdate); }
              if (this.mean === MeanLabel.yearly) { this.drawLayer(wmsUrl, `pm10_anmean_${year}_atmostreet`, geojson); }
              break;
            case PhenomenonLabel.PM25:
              if (this.mean === MeanLabel.hourly) { this.drawLayer(wmsUrl, 'pm25_hmean', geojson, lastUpdate); }
              if (this.mean === MeanLabel.daily) { this.drawLayer(wmsUrl, 'pm25_24hmean', geojson, lastUpdate); }
              if (this.mean === MeanLabel.yearly) { this.drawLayer(wmsUrl, `pm25_anmean_${year}_atmostreet`, geojson); }
              break;
            default:
              break;
          }
        });
      } else {
        wmsUrl = 'http://geo.irceline.be/forecast/wms';
        switch (this.phenomenonLabel) {
          case PhenomenonLabel.BelAQI:
            layerId = 'belaqi';
            break;
          case PhenomenonLabel.NO2:
            layerId = 'no2_maxhmean';
            break;
          case PhenomenonLabel.O3:
            layerId = 'o3_maxhmean';
            break;
          case PhenomenonLabel.PM10:
            layerId = 'pm10_dmean';
            break;
          case PhenomenonLabel.PM25:
            layerId = 'pm25_dmean';
            break;
          default:
            break;
        }
        switch (this.time) {
          case TimeLabel.today:
            timeParam = moment().format('YYYY-MM-DD');
            break;
          case TimeLabel.tomorrow:
            timeParam = moment().add(1, 'day').format('YYYY-MM-DD');
            break;
          case TimeLabel.today2:
            timeParam = moment().add(2, 'day').format('YYYY-MM-DD');
            break;
          case TimeLabel.today3:
            timeParam = moment().add(3, 'day').format('YYYY-MM-DD');
            break;
          default:
            break;
        }
      }
      this.drawLayer(wmsUrl, layerId, geojson, timeParam);
    });
  }

  private adjustMeanUI() {
    let show24hour = false;
    let showYearly = false;
    switch (this.selectedPhenomenonId) {
      case getIDForMainPhenomenon(MainPhenomenon.BC):
        showYearly = true;
        this.mean = MeanLabel.hourly;
        break;
      case getIDForMainPhenomenon(MainPhenomenon.NO2):
        showYearly = true;
        this.mean = MeanLabel.hourly;
        break;
      case getIDForMainPhenomenon(MainPhenomenon.O3):
        this.mean = MeanLabel.hourly;
        break;
      case getIDForMainPhenomenon(MainPhenomenon.PM10):
        show24hour = true;
        showYearly = true;
        this.mean = MeanLabel.hourly;
        break;
      case getIDForMainPhenomenon(MainPhenomenon.PM25):
        show24hour = true;
        showYearly = true;
        this.mean = MeanLabel.hourly;
        break;
      default:
        break;
    }
    this.show24hourMean = show24hour;
    this.showYearlyMean = showYearly;
    if (this.time !== TimeLabel.current) {
      this.disableMeans = true;
      this.mean = null;
    } else {
      this.disableMeans = false;
    }
  }

  private drawLayer(wmsUrl: string, layerId: string, geojson: GeoJSON.GeoJsonObject, timeParam?: string) {
    if (layerId) {
      const layerOptions: BoundaryCanvasOptions = {
        layers: layerId,
        transparent: true,
        format: 'image/png',
        tiled: 'true',
        opacity: 0.7,
        boundary: geojson,
        useBoundaryGreaterAsZoom: 12
      };
      if (timeParam) {
        layerOptions.time = timeParam;
      }
      this.overlayMaps.set(layerId + wmsUrl + timeParam, {
        label: this.translateSrvc.instant('map.interpolated-map'),
        visible: true,
        layer: tileLayer.boundaryCanvas(wmsUrl, layerOptions)
      });
    }
  }
}

class MarkerSelectorGeneratorImpl implements MarkerSelectorGenerator {

  constructor(
    private mapCache: MapCache,
    private mapId: string
  ) { }

  createFilledMarker(station: Station, color: string): Layer {
    let geometry: Layer;
    if (station.geometry.type === 'Point') {
      const point = station.geometry as GeoJSON.Point;
      geometry = circleMarker([point.coordinates[1], point.coordinates[0]], {
        color: '#000',
        fillColor: color,
        fillOpacity: 0.8,
        radius: this.calculateRadius(),
        weight: 2
      });
      if (this.mapCache.hasMap(this.mapId)) {
        this.mapCache.getMap(this.mapId).on('zoomend', () => {
          (geometry as CircleMarker).setRadius(this.calculateRadius());
        });
      }
    } else {
      geometry = geoJSON(station.geometry, {
        style: (feature) => {
          return {
            color: '#000',
            fillColor: color,
            fillOpacity: 0.8,
            weight: 2
          };
        }
      });
    }
    return geometry;
  }

  createDefaultFilledMarker(station: Station): Layer {
    return this.createFilledMarker(station, '#fff');
  }

  private calculateRadius(): number {
    if (this.mapCache.hasMap(this.mapId)) {
      const currentZoom = this.mapCache.getMap(this.mapId).getZoom();
      if (currentZoom <= 7) { return 6; }
      return currentZoom;
    } else {
      return 6;
    }
  }
}
