import { Component } from '@angular/core';
import { ApiInterface, ParameterFilter, Phenomenon, SettingsService } from '@helgoland/core';
import { LayerOptions } from '@helgoland/map';
import { NavController } from 'ionic-angular';
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
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public fitBounds: L.LatLngBoundsExpression;
  public mapOptions: L.MapOptions = {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false
  }

  public layerControlOptions: L.Control.LayersOptions = {};

  constructor(
    private settingsSrvc: SettingsService<MobileSettings>,
    private ircelineSettings: IrcelineSettingsProvider,
    private api: ApiInterface,
    private nav: NavController,
    private layerGen: LayerGeneratorService
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.providerUrl = settings.restApiUrls[0];
    this.clusterStations = settings.clusterStationsOnMap;
    this.fitBounds = settings.defaultBbox;

    this.ircelineSettings.getSettings().subscribe(ircelineSettings => {
      this.lastupdate = ircelineSettings.lastupdate;
      this.api.getPhenomenon(ircelineSettings.top_pollutant_today, this.providerUrl).subscribe(phenomenon => this.setPhenomenon(phenomenon));
      this.overlayMaps = this.layerGen.getLayersForPhenomenon(ircelineSettings.top_pollutant_today, ircelineSettings.lastupdate);
    })
  }

  // public onMapLoading(loading: boolean) {
  //   this.loading = loading;
  //   this.cdr.detectChanges();
  // }

  public navigateToMap() {
    this.nav.push(MapPage);
  }

  public setBounds(bounds: L.LatLngBoundsExpression) {
    this.fitBounds = bounds;
  }

  private setPhenomenon(selectedPhenomenon: Phenomenon) {
    console.log(selectedPhenomenon.id + ' ' + selectedPhenomenon.label);
    this.selectedPhenomenon = selectedPhenomenon;
    this.phenomenonFilter = { phenomenon: selectedPhenomenon.id };
  }
}
