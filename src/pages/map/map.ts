import './boundary-canvas';

import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DatasetApiInterface, ParameterFilter, Phenomenon, Platform, SettingsService, Station } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions, MapCache } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import L, {
  BoundaryCanvasOptions,
  CircleMarker,
  circleMarker,
  geoJSON,
  latLngBounds,
  LatLngExpression,
  Layer,
  popup,
} from 'leaflet';
import moment from 'moment';
import { MarkerSelectorGenerator } from 'src/components/customized-station-map-selector/customized-station-map-selector';

import { BelaqiSelection } from '../../components/belaqi-user-location-slider/belaqi-user-location-slider';
import { StationSelectorComponent } from '../../components/station-selector/station-selector';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { MobileSettings } from '../../providers/settings/settings';
import { DiagramPage } from '../diagram/diagram';

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

const phenomenonMapping = [
  {
    label: PhenomenonLabel.BelAQI,
    legendId: 'index'
  }, {
    id: '8',
    label: PhenomenonLabel.NO2,
    legendId: 'no2_hmean'
  }, {
    id: '7',
    label: PhenomenonLabel.O3,
    legendId: 'o3_hmean'
  }, {
    id: '5',
    label: PhenomenonLabel.PM10,
    legendId: 'pm10_hmean'
  }, {
    id: '6001',
    label: PhenomenonLabel.PM25,
    legendId: 'pm25_hmean'
  }, {
    id: '391',
    label: PhenomenonLabel.BC,
    legendId: 'bc_hmean'
  }
]

// const otherPhenomenonMapping = [
//   {
//     id: '10',
//     legendId: 'co_hmean'
//   }, {
//     id: '20',
//     legendId: 'c6h6_24hmean'
//   }, {
//     id: '1',
//     legendId: 'so2_hmean'
//   }
// ]

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  public name = 'map';

  public statusIntervalDuration: number;
  public geoSearchOptions: GeoSearchOptions;
  public phenomenonLabel: PhenomenonLabel;
  public time: TimeLabel = TimeLabel.current;
  // public selectedOtherPhenom: string;

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
  public nextStationPopup: L.Popup;
  public disabled: boolean;
  public markerSelectorGenerator: MarkerSelectorGenerator;

  public legend: L.Control;
  private legendVisible: boolean = false;

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
    this.markerSelectorGenerator = new MarkerSelectorGeneratorImpl(this.mapCache, this.mapId);

    this.setGeosearchOptions(settings);
    this.translateSrvc.onLangChange.subscribe(() => this.setGeosearchOptions);

    this.belaqiSelection = this.navParams.get('belaqiSelection') as BelaqiSelection;

    if (this.belaqiSelection) {
      const phenId = this.belaqiSelection.phenomenonStation.phenomenonId;
      this.phenomenonLabel = this.getPhenomenonLabel(phenId);
    } else {
      this.phenomenonLabel = PhenomenonLabel.BelAQI;
    }
    this.onPhenomenonChange();
  }

  private setGeosearchOptions(settings: MobileSettings) {
    this.geoSearchOptions = { countrycodes: settings.geoSearchCountryCodes, acceptLanguage: this.translateSrvc.currentLang };
  }

  public mapInitialized(mapId: string) {
    this.updateLegend();
    this.zoomToLocation();
  }

  private zoomToLocation() {
    if (this.mapCache.hasMap(this.mapId)) {
      const map = this.mapCache.getMap(this.mapId);
      const selection = this.navParams.get('belaqiSelection') as BelaqiSelection;
      if (selection) {
        const station = { lat: selection.phenomenonStation.latitude, lng: selection.phenomenonStation.longitude } as LatLngExpression;
        const location = { lat: selection.location.latitude, lng: selection.location.longitude } as LatLngExpression;
        this.nextStationPopup = popup({ autoPan: false })
          .setLatLng(station)
          .setContent(this.translateSrvc.instant('map.nearest-station'));
        map.addLayer(this.nextStationPopup);
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

  // public updateLegend() {
  //   if (this.legend) {
  //     this.legend.remove();
  //   }
  //   if (this.mapCache.hasMap(this.mapId)) {

  //     this.legend = new L.Control({ position: 'topright' });

  //     this.legend.onAdd = (map) => {
  //       const div = L.DomUtil.create('div', 'leaflet-bar legend');
  //       // let legendVisible = false;
  //       // const button = '<a class="info" role="button"></a>';
  //       div.innerHTML = this.getLegendContent();
  //       div.onclick = () => {
  //         const langCode = this.translateSrvc.currentLang.toLocaleUpperCase();
  //         let legendId = this.getPhenomenonLegendId(this.selectedPhenomenon.id);
  //         if (legendVisible) {
  //           div.innerHTML = button;
  //         } else {
  //           if (legendId) {
  //             div.innerHTML = `<img src="http://www.irceline.be/air/legend/${legendId}_${langCode}.svg">`
  //           } else {
  //             div.innerHTML = `<div>${this.translateSrvc.instant('map.no-legend')}</div>`;
  //           }
  //         }
  //         legendVisible = !legendVisible;
  //       }
  //       return div;
  //     };

  //     this.legend.addTo(this.mapCache.getMap(this.mapId));
  //   }
  // }

  private updateLegend() {
    if (this.legend) {
      this.legend.remove();
    }
    if (this.mapCache.hasMap(this.mapId)) {

      this.legend = new L.Control({ position: 'topright' });

      this.legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar legend');
        div.innerHTML = this.getLegendContent();
        div.onclick = () => this.toggleLegend(div)
        return div;
      };
      this.legend.addTo(this.mapCache.getMap(this.mapId));
    }
  }

  private toggleLegend(div: HTMLElement) {
    this.legendVisible = !this.legendVisible;
    div.innerHTML = this.getLegendContent();
    const moreLink = L.DomUtil.get('annual-more-link');
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
      let legendId = this.getPhenomenonLegendId(this.phenomenonLabel);
      if (legendId) {
        return `<img src="http://www.irceline.be/air/legend/${legendId}_${langCode}.svg">`;
      } else {
        return `<div>${this.translateSrvc.instant('map.no-legend')}</div>`;
      }
    }
    return '<a class="info" role="button"></a>';
  }

  public onPhenomenonChange(): void {
    this.showLayer();
    if (this.nextStationPopup) { this.nextStationPopup.remove(); }
    const phenID = this.getPhenomenonID(this.phenomenonLabel);
    if (phenID) {
      this.getPhenomenonFromAPI(phenID)
    } else {
      this.selectedPhenomenon = null;
      this.phenomenonFilter = { phenomenon: '' }
    }
    if (this.phenomenonLabel == PhenomenonLabel.BC) {
      this.time = TimeLabel.current;
    }
    if (this.legendVisible) { this.legendVisible = false }
    this.setDisabled();
  }

  private setDisabled() {
    this.disabled = this.phenomenonLabel === PhenomenonLabel.BC;
  }

  private getPhenomenonID(label: PhenomenonLabel): string {
    const phen = phenomenonMapping.find(e => label === e.label);
    if (phen) return phen.id;
  }

  private getPhenomenonLabel(id: string): PhenomenonLabel {
    const phen = phenomenonMapping.find(e => id === e.id);
    if (phen) return phen.label;
  }

  private getPhenomenonLegendId(phenLabel: PhenomenonLabel): string {
    let phen = phenomenonMapping.find(e => phenLabel === e.label);
    if (phen && phen.legendId) return phen.legendId;
    // let otherPhen = otherPhenomenonMapping.find(e => id === e.id);
    // if (otherPhen && otherPhen.legendId) return otherPhen.legendId;
  }

  public onTimeChange(): void {
    this.showLayer();
    this.setPhenomenonFilter();
  }

  private setPhenomenonFilter() {
    if (this.time != TimeLabel.current || !this.selectedPhenomenon) {
      this.phenomenonFilter = { phenomenon: '' };
    } else {
      this.phenomenonFilter = { phenomenon: this.selectedPhenomenon.id };
      this.updateLegend();
    }
  }

  // public openOtherPhenomena() {
  //   const modal = this.modalCtrl.create(ModalPhenomenonSelectorComponent, {
  //     providerUrl: this.providerUrl,
  //     selectedPhenomenonId: this.selectedPhenomenon ? this.selectedPhenomenon.id : null,
  //     hiddenPhenomenonIDs: phenomenonMapping.map(e => e.id)
  //   })
  //   modal._component
  //   modal.present();
  //   modal.onDidDismiss((selectedPhenomenon: Phenomenon) => {
  //     if (selectedPhenomenon) {
  //       this.setPhenomenon(selectedPhenomenon);
  //     }
  //   });
  // }

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
  }

  private showLayer() {
    this.httpClient.get('./assets/multipolygon.json').subscribe((geojson: GeoJSON.GeoJsonObject) => {
      this.overlayMaps = new Map<string, LayerOptions>();
      let layerId: string;
      let wmsUrl: string;
      let timeParam: string;
      if (this.time == TimeLabel.current) {
        this.ircelineSettings.getSettings(false).subscribe(ircSetts => {
          wmsUrl = 'http://geo.irceline.be/rioifdm/wms';
          timeParam = ircSetts.lastupdate.toISOString();
          switch (this.phenomenonLabel) {
            case PhenomenonLabel.BelAQI:
              layerId = 'belaqi';
              break;
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
          this.drawLayer(layerId, geojson, timeParam, wmsUrl);
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
      this.drawLayer(layerId, geojson, timeParam, wmsUrl);
    })
  }

  private drawLayer(layerId: string, geojson, timeParam: string, wmsUrl: string) {
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
      ;
      this.overlayMaps.set(layerId + wmsUrl + timeParam, {
        label: this.translateSrvc.instant('map.interpolated-map'),
        visible: true,
        layer: L.tileLayer.boundaryCanvas(wmsUrl, layerOptions)
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
        })
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
  };

  createDefaultFilledMarker(station: Station): Layer {
    return this.createFilledMarker(station, '#fff');
  };

  private calculateRadius(): number {
    if (this.mapCache.hasMap(this.mapId)) {
      const currentZoom = this.mapCache.getMap(this.mapId).getZoom();
      if (currentZoom <= 7) return 6;
      return currentZoom;
    } else {
      return 6;
    }
  }

}
