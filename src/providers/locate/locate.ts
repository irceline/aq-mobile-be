import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular/platform/platform';
import { Observable, ReplaySubject } from 'rxjs';

import { RefreshHandler } from '../refresh/refresh';

@Injectable()
export class LocateProvider {

  private position: ReplaySubject<Geoposition> = new ReplaySubject(1);
  private locationEnabledReplay: ReplaySubject<boolean> = new ReplaySubject(1);
  private locationEnabled: boolean;

  constructor(
    private platform: Platform,
    private geolocate: Geolocation,
    private diagnostic: Diagnostic,
    private refresher: RefreshHandler
  ) {
    this.registerLocationStateChangeHandler();
    this.isGeolocationEnabled();
    this.refresher.onRefresh.subscribe(() => this.determinePosition());
  }

  public getGeoposition(): Observable<Geoposition> {
    return this.position.asObservable();
  }

  public getLocationStateEnabled(): Observable<boolean> {
    return this.locationEnabledReplay.asObservable();
  }

  public getLocationEnabled(): boolean {
    return this.locationEnabled;
  }

  private registerLocationStateChangeHandler() {
    if (this.platform.is('cordova')) {
      this.diagnostic.registerLocationStateChangeHandler(() => this.isGeolocationEnabled());
    }
  }

  private isGeolocationEnabled() {
    if (this.platform.is('cordova')) {
      this.diagnostic.isGpsLocationEnabled().then((res) => {
        if (res) {
          this.setLocationEnabled(true);
          this.determinePosition();
        } else {
          this.setLocationEnabled(false);
        }
      });
    } else {
      this.setLocationEnabled(true);
      this.determinePosition();
    }
  }

  private setLocationEnabled(enabled: boolean) {
    this.locationEnabled = enabled;
    this.locationEnabledReplay.next(this.locationEnabled);
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
        this.position.next(res);
      }, (error) => {
        console.log(JSON.stringify(error));
        this.determinePosition();
      });
    })
  }

}