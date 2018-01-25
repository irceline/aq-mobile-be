import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiInterface, LayerOptions, Phenomenon, SettingsService } from 'helgoland-toolbox';
import { ParameterFilter } from 'helgoland-toolbox/dist/model/api/parameterFilter';
import { NavController, Slides } from 'ionic-angular';
import * as L from 'leaflet';

import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LayerGeneratorService } from '../../providers/layer-generator/layer-generator';
import { MobileSettings } from '../../providers/settings/settings';
import { MapPage } from '../map/map';

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
  public fitBounds: L.LatLngBoundsExpression;
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
    this.fitBounds = settings.bboxes.belgium;

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
        this.fitBounds = this.settingsSrvc.getSettings().bboxes.belgium;
        break;
      case 2:
        console.log('Flanders');
        this.fitBounds = this.settingsSrvc.getSettings().bboxes.flanders;
        break;
      case 3:
        console.log('Brussels');
        this.fitBounds = this.settingsSrvc.getSettings().bboxes.brussels;
        break;
      case 0:
      case 4:
        console.log('Wallonia');
        this.fitBounds = this.settingsSrvc.getSettings().bboxes.wallonia;
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
