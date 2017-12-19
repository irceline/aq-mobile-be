import { ChangeDetectorRef, Component } from '@angular/core';
import { MapOptions, Platform } from 'helgoland-toolbox';
import { Settings } from 'helgoland-toolbox/dist';
import { SettingsService } from 'helgoland-toolbox/dist/services/settings/settings.service';
import { ModalController } from 'ionic-angular';
import * as L from 'leaflet';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  public providerUrl: string;
  public loading: boolean;
  public mapOptions: MapOptions;

  public isEnter: boolean;

  constructor(
    private settingsSrvc: SettingsService<Settings>,
    public modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    this.providerUrl = this.settingsSrvc.getSettings().restApiUrls[0];

    const overlayMaps = new Map();
    overlayMaps.set('pm10_24hmean_1x1', L.tileLayer.wms('http://geo.irceline.be/wms', {
      layers: 'pm10_24hmean_1x1',
      transparent: true,
      format: 'image/png',
      time: '2017-12-18T12:00:00.000Z',
      opacity: 0.7,
      visibility: true,
      pane: 'tilePane',
      zIndex: -9998,
      projection: 'EPSG:4326',
      units: 'm'
    }));

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

  public ionViewWillEnter() {
    this.isEnter = true;
  }

  public onStationSelected(platform: Platform) {
    // const modal = this.modalCtrl.create(StationSelectorComponent,
    //   {
    //     platform,
    //     providerUrl: this.providerUrl
    //   }
    // );
    // modal.onDidDismiss(data => {
    //   if (data) { this.navigator.navigate(Page.Diagram); }
    // });
    // modal.present();
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

}
