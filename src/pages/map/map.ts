import './boundary-canvas';

import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DatasetApiInterface, ParameterFilter, Phenomenon, Platform, SettingsService } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions, MapCache } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import L, { BoundaryCanvasOptions, latLngBounds, LatLngExpression, popup } from 'leaflet';
import moment from 'moment';

import { BelaqiSelection } from '../../components/belaqi-user-location-slider/belaqi-user-location-slider';
import { ModalPhenomenonSelectorComponent } from '../../components/modal-phenomenon-selector/modal-phenomenon-selector';
import { StationSelectorComponent } from '../../components/station-selector/station-selector';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { MobileSettings } from '../../providers/settings/settings';
import { DiagramPage } from '../diagram/diagram';

enum PhenomenonLabel {
  NO2 = 'NO2',
  O3 = 'O3',
  PM10 = 'PM10',
  PM25 = 'PM25',
  BC = 'BC',
  OTHERS = 'Others'
}

enum TimeLabel {
  current = 'current',
  today = 'today',
  tomorrow = 'tomorrow',
  today2 = 'today2',
  today3 = 'today3'
}

const phenomenonMapping = [
  {
    id: '8',
    label: PhenomenonLabel.NO2
  }, {
    id: '7',
    label: PhenomenonLabel.O3
  }, {
    id: '5',
    label: PhenomenonLabel.PM10
  }, {
    id: '6001',
    label: PhenomenonLabel.PM25
  }, {
    id: '391',
    label: PhenomenonLabel.BC
  }
]

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  public name = 'map';

  public statusIntervalDuration: number;
  public geoSearchOptions: GeoSearchOptions;
  public phenomenonLabel: PhenomenonLabel = PhenomenonLabel.NO2;
  public otherPhenomenonLabel: string;
  public time: TimeLabel = TimeLabel.current;
  public selectedOtherPhenom: string;

  public providerUrl: string;
  public loading: boolean;
  public phenomenonFilter: ParameterFilter;
  public avoidZoomToSelection = true;
  public zoomControlOptions: L.Control.ZoomOptions = {};
  public layerControlOptions: L.Control.LayersOptions = { position: "bottomleft", hideSingleBase: true };
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public fitBounds: L.LatLngBoundsExpression;
  public clusterStations: boolean;
  public selectedPhenomenon: Phenomenon;

  public legend: L.Control;

  public mapId = 'map';

  private belaqiSelection: BelaqiSelection;

  constructor(
    protected navCtrl: NavController,
    protected settingsSrvc: SettingsService<MobileSettings>,
    protected navParams: NavParams,
    protected mapCache: MapCache,
    protected modalCtrl: ModalController,
    protected ircelineSettings: IrcelineSettingsProvider,
    protected api: DatasetApiInterface,
    protected cdr: ChangeDetectorRef,
    protected translateSrvc: TranslateService,
    protected httpClient: HttpClient
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.providerUrl = settings.datasetApis[0].url;
    this.clusterStations = settings.clusterStationsOnMap;
    this.statusIntervalDuration = settings.colorizedMarkerForLastMilliseconds;
    this.geoSearchOptions = { countrycodes: settings.geoSearchContryCodes };

    this.belaqiSelection = this.navParams.get('belaqiSelection') as BelaqiSelection;

    if (this.belaqiSelection) {
      this.getPhenomenonFromAPI(this.belaqiSelection.phenomenonStation.phenomenonId);
    } else {
      this.onPhenomenonChange();
    }
  }

  public mapInitialized(mapId: string) {
    this.showLegend();
    this.zoomToLocation();
  }

  private zoomToLocation() {
    if (this.mapCache.hasMap(this.mapId)) {
      const map = this.mapCache.getMap(this.mapId);
      const selection = this.navParams.get('belaqiSelection') as BelaqiSelection;
      if (selection) {
        const station = { lat: selection.phenomenonStation.latitude, lng: selection.phenomenonStation.longitude } as LatLngExpression;
        const location = { lat: selection.location.latitude, lng: selection.location.longitude } as LatLngExpression;
        map.addLayer(
          popup({ autoPan: false })
            .setLatLng(station)
            .setContent(this.translateSrvc.instant('map.nearest-station'))
        )
        const label = selection.location.type === 'user' ? this.translateSrvc.instant('map.configured-location') : this.translateSrvc.instant('map.current-location');
        map.addLayer(
          popup({ autoPan: false })
            .setLatLng(location)
            .setContent(label)
        )
        map.fitBounds(latLngBounds(station, station).extend(location), { padding: [70, 70] });
      } else {
        map.fitBounds(this.settingsSrvc.getSettings().defaultBbox);
      }
    }
  }

  public showLegend() {
    if (this.legend) {
      this.legend.remove();
    }
    if (this.mapCache.hasMap(this.mapId) && this.phenomenonLabel !== 'Others') {

      this.legend = new L.Control({ position: 'topright' });

      this.legend.onAdd = (map) => {
        const div = L.DomUtil.create('div', 'leaflet-bar legend');
        let legendVisible = false;
        const button = '<a class="info" role="button"></a>';
        div.innerHTML = button;
        div.onclick = () => {
          const langCode = this.translateSrvc.currentLang.toLocaleUpperCase();
          let legendId: string;
          switch (this.phenomenonLabel) {
            case PhenomenonLabel.BC:
              legendId = 'bc_hmean';
              break;
            case PhenomenonLabel.NO2:
              legendId = 'no2_hmean';
              break;
            case PhenomenonLabel.O3:
              legendId = 'o3_hmean';
              break;
            case PhenomenonLabel.PM10:
              legendId = 'pm10_hmean';
              break;
            case PhenomenonLabel.PM25:
              legendId = 'pm25_hmean';
              break;
            default:
              break;
          }
          div.innerHTML = legendVisible ? button : '<img src="http://www.irceline.be/air/legend/' + legendId + '_' + langCode + '.svg">';
          legendVisible = !legendVisible;
        }
        return div;
      };

      this.legend.addTo(this.mapCache.getMap(this.mapId));
    }
  }

  public onPhenomenonChange(): void {
    this.otherPhenomenonLabel = '';
    const phenID = this.getPhenomenonID(this.phenomenonLabel);
    if (phenID) { this.getPhenomenonFromAPI(phenID) }
    this.selectedOtherPhenom = '';
    if (this.phenomenonLabel == PhenomenonLabel.BC) {
      this.time = TimeLabel.current;
    }
  }

  public isDisabled(): boolean {
    return this.phenomenonLabel == PhenomenonLabel.BC;
  }

  private getPhenomenonID(label: PhenomenonLabel): string {
    const phen = phenomenonMapping.find(e => label === e.label);
    if (phen) return phen.id;
  }

  private getPhenomenonLabel(id: string): PhenomenonLabel {
    const phen = phenomenonMapping.find(e => id === e.id);
    if (phen) return phen.label;
  }

  public onTimeChange(): void {
    this.showLayer();
    this.setPhenomenonFilter();
  }

  private setPhenomenonFilter() {
    if (this.time != TimeLabel.current) {
      this.phenomenonFilter = { phenomenon: '' };
    } else {
      this.phenomenonFilter = { phenomenon: this.selectedPhenomenon.id };
      this.showLegend();
    }
  }

  public openOtherPhenomena() {
    this.otherPhenomenonLabel = '';
    const modal = this.modalCtrl.create(ModalPhenomenonSelectorComponent, {
      providerUrl: this.providerUrl,
      selectedPhenomenonId: this.selectedPhenomenon ? this.selectedPhenomenon.id : null,
      hiddenPhenomenonIDs: phenomenonMapping.map(e => e.id)
    })
    modal._component
    modal.present();
    modal.onDidDismiss((selectedPhenomenon: Phenomenon) => {
      if (selectedPhenomenon) {
        this.otherPhenomenonLabel = selectedPhenomenon.label;
        this.setPhenomenon(selectedPhenomenon);
      }
    });
  }

  public onStationSelected(platform: Platform) {
    const modal = this.modalCtrl.create(StationSelectorComponent,
      {
        platform,
        providerUrl: this.providerUrl,
        phenomenonId: this.selectedPhenomenon.id
      }
    );
    modal.onDidDismiss(data => { if (data) { this.navCtrl.push(DiagramPage) } });
    modal.present();
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

  private getPhenomenonFromAPI(phenId: string) {
    this.api.getPhenomenon(phenId, this.providerUrl).subscribe(phenomenon => this.setPhenomenon(phenomenon));
  }

  private setPhenomenon(selectedPhenomenon: Phenomenon) {
    this.selectedPhenomenon = selectedPhenomenon;
    this.setPhenomenonFilter();
    this.phenomenonLabel = this.getPhenomenonLabel(selectedPhenomenon.id);
    this.showLayer();
  }

  private showLayer() {
    this.httpClient.get('./assets/multipolygon.json').subscribe((geojson: GeoJSON.GeoJsonObject) => {
      this.overlayMaps = new Map<string, LayerOptions>();
      let layerId: string;
      let wmsUrl: string;
      let timeParam: string;
      if (this.time == TimeLabel.current) {
        wmsUrl = 'http://geo.irceline.be/rioifdm/wms';
        switch (this.phenomenonLabel) {
          case PhenomenonLabel.BC:
            layerId = 'bc_hmean';
            break;
          case PhenomenonLabel.NO2:
            layerId = 'no2_hmean';
            break;
          case PhenomenonLabel.O3:
            layerId = 'o3_hmean';
            break;
          case PhenomenonLabel.PM10:
            layerId = 'pm10_hmean';
            break;
          case PhenomenonLabel.PM25:
            layerId = 'pm25_hmean';
            break;
          default:
            break;
        }
      } else {
        wmsUrl = 'http://geo.irceline.be/forecast/wms';
        switch (this.phenomenonLabel) {
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
      const layerOptions: BoundaryCanvasOptions = {
        layers: layerId,
        transparent: true,
        format: 'image/png',
        opacity: 0.7,
        boundary: geojson,
        useBoundaryGreaterAsZoom: 12
      }
      if (timeParam) { layerOptions.time = timeParam };
      this.overlayMaps.set(layerId + wmsUrl + timeParam, {
        label: this.translateSrvc.instant('map.interpolated-map'),
        visible: true,
        layer: L.tileLayer.boundaryCanvas(wmsUrl, layerOptions)
      });
    })
  }

}
