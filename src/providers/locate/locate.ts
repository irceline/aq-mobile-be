import { Injectable } from '@angular/core';
import { GeoReverseResult, GeoSearch } from '@helgoland/map';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LocateProvider {

  private locationEnabledReplay: ReplaySubject<boolean> = new ReplaySubject(1);
  private locationEnabled: boolean;

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
  public getLocationStateEnabled(): Observable<boolean> {
    return this.locationEnabledReplay.asObservable();
  }

  /**
   * Return the current state of enabled location.
   */
  public getLocationEnabled(): boolean {
    return this.locationEnabled;
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
        if (res) {
          this.setLocationEnabled(true);
        } else {
          this.setLocationEnabled(false);
        }
      });
    } else {
      this.setLocationEnabled(true);
    }
  }

  private setLocationEnabled(enabled: boolean) {
    this.locationEnabled = enabled;
    this.locationEnabledReplay.next(this.locationEnabled);
  }

  public determinePosition(): Observable<Geoposition> {
    return new Observable((observer: Observer<Geoposition>) => {
      this.platform.ready().then(() => {
        this.geolocate.getCurrentPosition({
          timeout: 30000
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
