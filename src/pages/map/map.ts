import { ChangeDetectorRef, Component } from '@angular/core';
import { DatasetApiInterface, ParameterFilter, Phenomenon, Platform, SettingsService } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions } from '@helgoland/map';
import { ModalController, NavController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import * as L from 'leaflet';

import {
  PhenomenonSelectorPopoverComponent,
} from '../../components/phenomenon-selector-popover/phenomenon-selector-popover';
import { StationSelectorComponent } from '../../components/station-selector/station-selector';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LayerGeneratorService } from '../../providers/layer-generator/layer-generator';
import { MobileSettings } from '../../providers/settings/settings';
import { DiagramPage } from '../diagram/diagram';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  public providerUrl: string;
  public loading: boolean;
  public phenomenonFilter: ParameterFilter;
  public selectedPhenomenon: Phenomenon;
  public clusterStations: boolean;

  public avoidZoomToSelection = true;
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public fitBounds: L.LatLngBoundsExpression;
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft', hideSingleBase: true };
  public zoomControlOptions: L.Control.ZoomOptions = {};
  public geoSearchOptions: GeoSearchOptions;

  constructor(
    private settingsSrvc: SettingsService<MobileSettings>,
    private nav: NavController,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private popoverCtrl: PopoverController,
    private ircelineSettings: IrcelineSettingsProvider,
    private api: DatasetApiInterface,
    private layerGen: LayerGeneratorService
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.providerUrl = settings.datasetApis[0].url;
    this.clusterStations = settings.clusterStationsOnMap;
    this.fitBounds = settings.defaultBbox;
    this.geoSearchOptions = { countrycodes: settings.geoSearchContryCodes };

    this.ircelineSettings.getSettings(false).subscribe((settings) => {
      this.api.getPhenomenon(settings.top_pollutant_today, this.providerUrl).subscribe(phenomenon => this.setPhenomenon(phenomenon));
    })
  }

  public onStationSelected(platform: Platform) {
    const modal = this.modalCtrl.create(StationSelectorComponent,
      {
        platform,
        providerUrl: this.providerUrl
      }
    );
    modal.onDidDismiss(data => { if (data) { this.nav.push(DiagramPage) } });
    modal.present();
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

  public openPhenomenonSelector(event: any) {
    const popover = this.popoverCtrl.create(PhenomenonSelectorPopoverComponent, {
      providerUrl: this.providerUrl,
      selectedPhenomenonId: this.selectedPhenomenon ? this.selectedPhenomenon.id : null
    });
    popover.present({ ev: event });
    popover.onDidDismiss((selectedPhenomenon: Phenomenon) => {
      if (selectedPhenomenon) {
        this.setPhenomenon(selectedPhenomenon);
      }
    })
  }

  private setPhenomenon(selectedPhenomenon: Phenomenon) {
    this.selectedPhenomenon = selectedPhenomenon;
    this.phenomenonFilter = { phenomenon: selectedPhenomenon.id };
    this.ircelineSettings.getSettings(false).subscribe(settings =>
      this.overlayMaps = this.layerGen.getLayersForPhenomenon(selectedPhenomenon.id, settings.lastupdate, true)
    );
  }
}
