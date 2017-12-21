import { ChangeDetectorRef, Component } from '@angular/core';
import { LayerOptions, MapOptions, Phenomenon, Platform, Settings, SettingsService } from 'helgoland-toolbox';
import { ParameterFilter } from 'helgoland-toolbox/dist/model/api/parameterFilter';
import { ModalController, NavController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import * as L from 'leaflet';

import {
  PhenomenonSelectorPopoverComponent,
} from '../../components/phenomenon-selector-popover/phenomenon-selector-popover';
import { StationSelectorComponent } from '../../components/station-selector/station-selector';
import { DiagramPage } from '../diagram/diagram';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  public providerUrl: string;
  public loading: boolean;
  public mapOptions: MapOptions;
  public phenomenonFilter: ParameterFilter;
  public selectedPhenomenon: Phenomenon;

  constructor(
    private settingsSrvc: SettingsService<Settings>,
    private nav: NavController,
    public modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private popoverCtrl: PopoverController
  ) {
    this.providerUrl = this.settingsSrvc.getSettings().restApiUrls[0];

    const timestring = '2017-12-19T01:00:00.000Z';

    const overlayMaps = new Map<LayerOptions, L.Layer>();
    overlayMaps.set(
      { name: 'pm10_24hmean_1x1', visible: false },
      L.tileLayer.wms('http://geo.irceline.be/wms', {
        layers: 'pm10_24hmean_1x1',
        transparent: true,
        format: 'image/png',
        time: timestring,
        opacity: 0.7,
        visibility: false,
        pane: 'tilePane',
        zIndex: -9998,
        projection: 'EPSG:4326',
        units: 'm'
      }));
    overlayMaps.set(
      { name: 'realtime:o3_station_max', visible: true },
      L.tileLayer.wms("http://geo.irceline.be/wms", {
        layers: 'realtime:o3_station_max',
        transparent: true,
        format: 'image/png',
        time: timestring,
        visibility: false,
        pane: 'tilePane',
        zIndex: -9997,
        projection: 'EPSG:4326',
        units: 'm'
      }))

    this.mapOptions = {
      overlayMaps,
      layerControlOptions: {
        hideSingleBase: true,
        position: 'bottomleft'
      },
      zoomOptions: {},
      fitBounds: [[49.5, 3.27], [51.5, 5.67]],
      avoidZoomToSelection: true
    }
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
    popover.present({
      ev: event
    })
    popover.onDidDismiss((selectedPhenomenon: Phenomenon) => {
      if (selectedPhenomenon) {
        console.log(selectedPhenomenon.id + ' ' + selectedPhenomenon.label);
        this.selectedPhenomenon = selectedPhenomenon;
        this.phenomenonFilter = { phenomenon: selectedPhenomenon.id };
      }
    })
  }

}
