import { EventEmitter, Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular/platform/platform';

import { RefreshHandler } from '../refresh/refresh';

@Injectable()
export class LocateProvider {

  public lastPosition: Geoposition;
  public locationEnabled: boolean;

  public onPositionUpdate: EventEmitter<Geoposition> = new EventEmitter();
  public onLocationStateChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private platform: Platform,
    private geolocate: Geolocation,
    private diagnostic: Diagnostic,
    private refresher: RefreshHandler
  ) {
    this.registerLocationStateChangeHandler();
    this.isGeolocationEnabled();
    this.refresher.onRefresh.subscribe(res => this.isGeolocationEnabled());
  }

  private registerLocationStateChangeHandler() {
    if (this.platform.is('cordova')) {
      this.diagnostic.registerLocationStateChangeHandler(() => {
        this.isGeolocationEnabled();
      });
    }
  }

  private isGeolocationEnabled() {
    if (this.platform.is('cordova')) {
      this.diagnostic.isGpsLocationEnabled().then((res) => {
        if (res) {
          this.locationEnabled = true;
          this.determinePosition();
        } else {
          this.locationEnabled = false;
        }
        this.onLocationStateChange.emit(this.locationEnabled);
      });
    } else {
      this.locationEnabled = true;
      this.onLocationStateChange.emit(true);
      this.determinePosition();
    }
  }

  private determinePosition() {
    this.platform.ready().then(() => {
      this.geolocate.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 60000
      }).then(res => {
        
        // const latitude = 50.863892;
        // const longitude = 4.6337528;
        // const latitude = 50 + Math.random();
        // const longitude = 4 + Math.random();
        // res = {
        //   coords: {
        //     latitude: latitude,
        //     longitude: longitude,
        //     accuracy: 0,
        //     altitude: 0,
        //     altitudeAccuracy: 0,
        //     heading: 0,
        //     speed: 0
        //   },
        //   timestamp: 1234
        // }

        this.lastPosition = res;
        this.onPositionUpdate.emit(res);
      }).catch((error) => console.log(JSON.stringify(error)));
    })
  }

}