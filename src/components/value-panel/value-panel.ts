import { Component } from '@angular/core';
import { DatasetApiInterface, FirstLastValue, SettingsService, Station } from '@helgoland/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { ModelledValueProvider } from '../../providers/modelled-value/modelled-value';
import { RefreshHandler } from '../../providers/refresh/refresh';
import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'value-panel',
  templateUrl: 'value-panel.html'
})
export class ValuePanelComponent {

  public position: Geoposition;
  public modelledValue: number;
  public lastStationaryValue: FirstLastValue;
  public uom: string;
  public loadingModelledValue: boolean = true;
  public loadingStationValue: boolean = true;
  public geolocationDisabled: boolean = false;
  public nearestStation: Station;
  public stationDistance: number;

  constructor(
    private modelledService: ModelledValueProvider,
    private geolocate: Geolocation,
    private backGeo: BackgroundGeolocation,
    private api: DatasetApiInterface,
    private settingsSrvc: SettingsService<MobileSettings>,
    private irceline: IrcelineSettingsProvider,
    private platform: Platform,
    private refresher: RefreshHandler
  ) {
    this.triggerTask();
    this.refresher.onRefresh.subscribe(() => this.triggerTask());
  }

  private triggerTask() {
    if (this.platform.is('cordova')) {
      this.backGeo.isLocationEnabled().then(res => {
        if (res) {
          this.determineValues();
          this.geolocationDisabled = false;
        }
        else {
          this.geolocationDisabled = true;
        }
      });
    }
    else {
      this.determineValues();
    }
  }

  private determineValues() {
    this.platform.ready().then(() => {
      this.geolocate.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 60000
      }).then(res => {
        this.position = res;
        if (this.position.coords) {
          // const latitude = 50.863892;
          // const longitude = 4.6337528;
          // const latitude = 50 + Math.random();
          // const longitude = 4 + Math.random();
          const latitude = this.position.coords.latitude;
          const longitude = this.position.coords.longitude;
          this.determineModelledValue(latitude, longitude);
          this.determineNextStationValue(latitude, longitude);
        }
      }).catch((error) => console.log(JSON.stringify(error)));
    })
  }

  private determineModelledValue(latitude: number, longitude: number) {
    this.irceline.getSettings(false).subscribe(ircelineValues => {
      this.modelledService.getIndex(latitude, longitude, ircelineValues.lastupdate).subscribe(value => {
        this.modelledValue = value;
      }, error => {
        this.loadingModelledValue = false;
      }, () => {
        this.loadingModelledValue = false;
      });
    })
  }

  private determineNextStationValue(latitude: number, longitude: number) {
    const url = this.settingsSrvc.getSettings().restApiUrls[0];
    const phenomenonId = '8';
    this.api.getStations(url, {
      phenomenon: phenomenonId,
    }).subscribe(stations => {
      this.nearestStation = null;
      this.stationDistance = Infinity;
      stations.forEach(station => {
        const stationLat = station.geometry.coordinates[1];
        const stationLon = station.geometry.coordinates[0];
        const stationDis = this.distanceInKmBetweenEarthCoordinates(latitude, longitude, stationLat, stationLon);
        if (stationDis < this.stationDistance) {
          this.stationDistance = stationDis;
          this.nearestStation = station;
        }
      })
      this.api.getTimeseries(url, {
        phenomenon: phenomenonId,
        station: this.nearestStation.properties.id,
        expanded: true
      }, { forceUpdate: true }).subscribe(series => {
        if (series.length == 1) {
          this.lastStationaryValue = series[0].lastValue
          this.uom = series[0].uom;
        }
        this.loadingStationValue = false;
      })
    }, error => this.loadingStationValue = false);
  }

  private distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2 - lat1);
    var dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  private degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }

}
