import { AfterViewInit, Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearchOptions, MapCache } from '@helgoland/map';
import { NavController, NavParams } from 'ionic-angular';
import L from 'leaflet';

import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html',
})
export class ForecastPage implements AfterViewInit {

  public map: L.Map;
  public geoSearchOptions: GeoSearchOptions;
  public phenomenon: string = 'NO2';
  public time: string = 'today';

  constructor(
    protected navCtrl: NavController,
    protected settingsSrvc: SettingsService<MobileSettings>,
    protected navParams: NavParams,
    protected mapCache: MapCache
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.geoSearchOptions = { countrycodes: settings.geoSearchContryCodes };
  }

  public ngAfterViewInit(): void {
    this.createMap();
  }

  public onPhenomenonChange(): void {
  }

  public onTimeChange(): void {
  }

  private createMap() {
    this.map = L.map('forecast-map', {}).setView([50.5, 4.5], 7);
    this.mapCache.setMap('forecast-map', this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // L.tileLayer.wms("http://geo.irceline.be/forecast/wms", {
    //   layers: 'o3_maxhmean',
    //   transparent: true,
    //   format: 'image/png',
    //   time: '2018-05-08',
    //   opacity: 0.7
    // }).addTo(this.map);
  }

}
