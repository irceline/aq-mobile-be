import { ChangeDetectorRef, Component } from '@angular/core';
import { LayerOptions, MapOptions, Platform, Settings, SettingsService } from 'helgoland-toolbox';
import { ModalController } from 'ionic-angular';
import { Nav } from 'ionic-angular/components/nav/nav';
import * as L from 'leaflet';

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

  constructor(
    private settingsSrvc: SettingsService<Settings>,
    private nav: Nav,
    public modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
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
    this.nav.setRoot(DiagramPage);
    const modal = this.modalCtrl.create(StationSelectorComponent,
      {
        platform,
        providerUrl: this.providerUrl
      }
    );
    modal.onDidDismiss(data => {
      // debugger;
      // if (data) { this.navigator.navigate(Page.Diagram); }
    });
    modal.present();
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

}
