import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiInterface, LayerOptions, Phenomenon, SettingsService } from 'helgoland-toolbox';
import { ParameterFilter } from 'helgoland-toolbox/dist/model/api/parameterFilter';
import { NavController, Slides } from 'ionic-angular';
import * as L from 'leaflet';

import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { MobileSettings } from '../../providers/settings/settings';
import { MapPage } from '../map/map';

const BELGIUM_BBOX: L.LatLngBoundsExpression = [[49.5, 3.27], [51.5, 5.67]];
const FLANDERS_BBOX: L.LatLngBoundsExpression = [[50.6874, 2.5456], [51.5051, 5.9111]];
const BRUSSELS_BBOX: L.LatLngBoundsExpression = [[50.7963, 4.3139], [50.9140, 4.4371]];
const WALLONIA_BBOX: L.LatLngBoundsExpression = [[49.4969, 2.8420], [50.8120, 6.4081]];

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  public lastupdate: Date;

  public providerUrl: string;
  public loading: boolean = true;
  public phenomenonFilter: ParameterFilter;
  public selectedPhenomenon: Phenomenon;
  public clusterStations: boolean;

  public avoidZoomToSelection = true;
  public overlayMaps: Map<LayerOptions, L.Layer> = new Map<LayerOptions, L.Layer>();
  public fitBounds: L.LatLngBoundsExpression = BRUSSELS_BBOX;
  public mapOptions: L.MapOptions = {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: true
  }

  constructor(
    private settingsSrvc: SettingsService<MobileSettings>,
    private cdr: ChangeDetectorRef,
    private ircelineSettings: IrcelineSettingsProvider,
    private api: ApiInterface,
    private nav: NavController
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.providerUrl = settings.restApiUrls[0];
    this.clusterStations = settings.clusterStationsOnMap;

    this.ircelineSettings.onLastUpdateChanged.subscribe((lastupdate: Date) => this.lastupdate = lastupdate);

    this.ircelineSettings.onTopPollutantTodayChanged.subscribe(pullutantId => {
      this.api.getPhenomenon(pullutantId, this.providerUrl).subscribe(phenomenon => this.setPhenomenon(phenomenon));
    });

    this.updateMapOptions(null);
  }

  private updateMapOptions(time: Date) {
    this.overlayMaps = new Map<LayerOptions, L.Layer>();
    if (time) {
      this.overlayMaps.set({ name: 'pm10_24hmean_1x1', visible: true },
        L.tileLayer.wms('http://geo.irceline.be/rio/wms', {
          layers: 'pm10_hmean_1x1',
          transparent: true,
          format: 'image/png',
          time: '2018-01-05T11:00:00.000Z',
          opacity: 0.7,
          tiled: true,
          visibility: true,
          pane: 'tilePane',
          zIndex: -9998,
          projection: 'EPSG:4326',
          units: 'm'
        })
      );
      this.overlayMaps.set({ name: 'realtime:o3_station_max', visible: true },
        L.tileLayer.wms("http://geo.irceline.be/wms", {
          layers: 'realtime:o3_station_max',
          transparent: true,
          format: 'image/png',
          time: time.toISOString(),
          visibility: false,
          pane: 'tilePane',
          zIndex: -9997,
          projection: 'EPSG:4326',
          units: 'm'
        })
      );
    }
  }

  public slideChanged(slides: Slides) {
    switch (slides.getActiveIndex()) {
      case 1:
      case 5:
        console.log('Belgium');
        this.fitBounds = BELGIUM_BBOX;
        break;
      case 2:
        console.log('Flanders');
        this.fitBounds = FLANDERS_BBOX;
        break;
      case 3:
        console.log('Brussels');
        this.fitBounds = BRUSSELS_BBOX;
        break;
      case 0:
      case 4:
        console.log('Wallonia');
        this.fitBounds = WALLONIA_BBOX;
        break;
      default:
        console.log('undefined');
        break;
    }
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

  public navigateToMap() {
    debugger;
    this.nav.push(MapPage);
  }

  private setPhenomenon(selectedPhenomenon: Phenomenon) {
    console.log(selectedPhenomenon.id + ' ' + selectedPhenomenon.label);
    this.selectedPhenomenon = selectedPhenomenon;
    this.phenomenonFilter = { phenomenon: selectedPhenomenon.id };
  }
}
