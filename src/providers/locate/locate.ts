import { Injectable } from '@angular/core';
import { GeoReverseResult, GeoSearch } from '@helgoland/map';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const enum LocationMode {
  on,
  off,
  partial
}

@Injectable()
export class LocateProvider {

  private locationModeReplay: ReplaySubject<LocationMode> = new ReplaySubject(1);
  private locationMode: LocationMode;

  constructor(
    private platform: Platform,
    private geolocate: Geolocation,
    private diagnostic: Diagnostic,
    private translate: TranslateService,
    private toast: ToastController,
    private geosearch: GeoSearch
  ) {
    this.registerLocationStateChangeHandler();
    this.isGeolocationEnabled();
    this.platform.resume.subscribe(() => this.isGeolocationEnabled());
  }

  /**
   * Returns the location state as Observable.
   */
  public getLocationModeAsObservable(): Observable<LocationMode> {
    return this.locationModeReplay.asObservable();
  }

  /**
   * Return the current state of enabled location.
   */
  public getLocationMode(): LocationMode {
    return this.locationMode;
  }

  private registerLocationStateChangeHandler() {
    if (this.platform.is('cordova')) {
      this.diagnostic.registerLocationStateChangeHandler(() => {
        this.isGeolocationEnabled();
        this.diagnostic.isLocationEnabled().then((res) => {
          const message = res ? this.translate.instant('network.geolocationEnabled') : this.translate.instant('network.geolocationDisabled');
          this.toast.create({ message, duration: 5000 }).present();
        })
      });
    }
  }

  private isGeolocationEnabled() {
    if (this.platform.is('cordova')) {
      this.diagnostic.isLocationEnabled().then((res) => {
        if (this.platform.is('android')) {
          this.diagnostic.getLocationMode().then(locMode => {
            switch (locMode) {
              case this.diagnostic.locationMode.HIGH_ACCURACY:
                this.setLocationEnabled(LocationMode.on);
                break;
              case this.diagnostic.locationMode.BATTERY_SAVING:
                this.setLocationEnabled(LocationMode.partial);
                break;
              case this.diagnostic.locationMode.DEVICE_ONLY:
                this.setLocationEnabled(LocationMode.partial);
                break;
              case this.diagnostic.locationMode.LOCATION_OFF:
                this.setLocationEnabled(LocationMode.off);
                break;
            }
          }, error => this.setLocationEnabled(LocationMode.off));
        } else if (res) {
          this.setLocationEnabled(LocationMode.on);
        } else {
          this.setLocationEnabled(LocationMode.off);
        }
      });
    } else {
      this.setLocationEnabled(LocationMode.on);
    }
  }

  private setLocationEnabled(mode: LocationMode) {
    this.locationMode = mode;
    this.locationModeReplay.next(this.locationMode);
  }

  public determinePosition(): Observable<Geoposition> {
    return new Observable((observer: Observer<Geoposition>) => {
      this.platform.ready().then(() => {
        this.geolocate.getCurrentPosition({
          timeout: 15000
        }).then(res => {
          observer.next(res);
          observer.complete();
        }).catch((error) => {
          let errorMessage: string;
          if (error && error.message) {
            errorMessage = error.message;
          } else {
            errorMessage = JSON.stringify(error);
          }
          observer.error(error);
          observer.complete();
          this.toast.create({ message: `Error occured, while fetch location: ${errorMessage}`, duration: 3000 }).present();
        });
      })
    })
  }

  public determineGeoLocation(): Observable<GeoReverseResult> {
    return this.determinePosition().pipe(switchMap(location =>
      this.geosearch.reverse(
        { type: 'Point', coordinates: [location.coords.latitude, location.coords.longitude] },
        { acceptLanguage: this.translate.currentLang }
      )
    ))
  }
}
