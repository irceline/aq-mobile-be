import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';
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
    private refresher: RefreshHandler,
    private toast: ToastController
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
    this.toast.create({ message: `Start determine position`, duration: 1000 }).present();
    this.platform.ready().then(() => {
      this.geolocate.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 60000
      }).then(res => {
        this.position.next(res);
        this.toast.create({ message: `Find position: lat: ${res.coords.latitude}, lon: ${res.coords.longitude}`, duration: 3000 }).present();
      }).catch((error) => {
        console.log(JSON.stringify(error));
        this.toast.create({ message: `Location-Error: ${error}`, duration: 3000 }).present();
        this.determinePosition();
      });
    })
  }

}