import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiInterface, LayerOptions, Phenomenon, SettingsService } from 'helgoland-toolbox';
import { ParameterFilter } from 'helgoland-toolbox/dist/model/api/parameterFilter';
import { NavController, Slides } from 'ionic-angular';
import * as L from 'leaflet';

import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LayerGeneratorService } from '../../providers/layer-generator/layer-generator';
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
    scrollWheelZoom: true,
    dragging: true
  }

  public layerControlOptions: L.Control.LayersOptions = {};

  constructor(
    private settingsSrvc: SettingsService<MobileSettings>,
    private cdr: ChangeDetectorRef,
    private ircelineSettings: IrcelineSettingsProvider,
    private api: ApiInterface,
    private nav: NavController,
    private layerGen: LayerGeneratorService
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.providerUrl = settings.restApiUrls[0];
    this.clusterStations = settings.clusterStationsOnMap;

    this.ircelineSettings.getSettings().subscribe(settings => {
      this.lastupdate = settings.lastupdate;
      this.api.getPhenomenon(settings.top_pollutant_today, this.providerUrl).subscribe(phenomenon => this.setPhenomenon(phenomenon));
      this.overlayMaps = this.layerGen.getLayersForPhenomenon(settings.top_pollutant_today, settings.lastupdate);
    })
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
    this.nav.push(MapPage);
  }

  private setPhenomenon(selectedPhenomenon: Phenomenon) {
    console.log(selectedPhenomenon.id + ' ' + selectedPhenomenon.label);
    this.selectedPhenomenon = selectedPhenomenon;
    this.phenomenonFilter = { phenomenon: selectedPhenomenon.id };
  }
}
