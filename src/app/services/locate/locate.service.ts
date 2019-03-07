import { Injectable } from '@angular/core';
import { GeoReverseResult, GeoSearch } from '@helgoland/map';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const enum LocationStatus {
  HIGH_ACCURACY = 'HIGH_ACCURACY',
  BATTERY_SAVING = 'BATTERY_SAVING',
  DEVICE_ONLY = 'DEVICE_ONLY',
  OFF = 'OFF',
  DENIED = 'DENIED'
}

const LOCATE_MAXIMUM_AGE = 1000 * 60 * 5; // 5 minutes
const LOCATE_TIMEOUT_HIGH_ACCURACY = 1000 * 30; // 30 seconds
const LOCATE_TIMEOUT_UNTIL_HIGH_ACC_REQUEST = 1000 * 10; // 10 seconds

@Injectable()
export class LocateService {

  private locationStatusReplay: ReplaySubject<LocationStatus> = new ReplaySubject(1);
  private locationStatus: LocationStatus;

  private resumeSubscription;

  constructor(
    private platform: Platform,
    private geolocate: Geolocation,
    private diagnostic: Diagnostic,
    private translate: TranslateService,
    private toast: ToastController,
    private geosearch: GeoSearch,
    private locationAccuracy: LocationAccuracy
  ) {
    this.registerLocationStateChangeHandler();
    this.isGeolocationEnabled();
    this.subscribeToResume();
  }

  /**
   * Returns the location state as Observable.
   */
  public getLocationStatusAsObservable(): Observable<LocationStatus> {
    return this.locationStatusReplay.asObservable();
  }

  /**
   * Return the current state of enabled location.
   */
  public getLocationStatus(): LocationStatus {
    return this.locationStatus;
  }

  public askForPermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.diagnostic.isLocationAuthorized()
        .then(auth => {
          if (auth) {
            resolve(true);
          } else {
            this.diagnostic.requestLocationAuthorization()
              .then(res => {
                if (res === 'DENIED') {
                  resolve(false);
                } else {
                  resolve(true);
                }
                resolve(res);
              })
              .catch(error => reject(error));
          }
        })
        .catch(error => reject(error));
    });
  }

  public askForHighAccuracy(): Promise<void> {
    // do not hear on resume while ask the user for high accuracy mode
    this.unsubscribeToResume();
    return new Promise((resolve, reject) => {
      this.locationAccuracy
        .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            setTimeout(() => this.subscribeToResume(), 1000);
            resolve();
          },
          error => {
            setTimeout(() => this.subscribeToResume(), 1000);
            reject('High Accuracy permission denied');
          }
        );
    });
  }

  private registerLocationStateChangeHandler() {
    if (this.platform.is('cordova')) {
      this.diagnostic.registerLocationStateChangeHandler(() => {
        this.isGeolocationEnabled();
        this.diagnostic.isLocationEnabled().then((res) => {
          const message = res ? this.translate.instant('network.geolocationEnabled')
            : this.translate.instant('network.geolocationDisabled');
          this.toast.create({ message, duration: 5000 }).then(toast => toast.present());
        });
      });
    }
  }

  public determineGeoLocation(askForPermission?: boolean): Observable<GeoReverseResult> {
    return this.getUserLocation(askForPermission).pipe(switchMap(location =>
      this.geosearch.reverse(
        { type: 'Point', coordinates: [location.coords.latitude, location.coords.longitude] },
        { acceptLanguage: this.translate.currentLang }
      )
    ));
  }

  public getUserLocation(askForPermission?: boolean): Observable<Geoposition> {
    return new Observable((observer: Observer<Geoposition>) => {
      if (this.locationStatus !== LocationStatus.DENIED || askForPermission) {
        if (this.platform.is('cordova')) {
          this.platform.ready().then(() => {
            this.diagnostic.isLocationEnabled().then(enabled => {
              if (enabled) {
                if (this.platform.is('android')) {
                  this.diagnostic.getLocationMode().then(locationMode => {
                    // high accuracy => do locate
                    if (locationMode === this.diagnostic.locationMode.HIGH_ACCURACY) {
                      this.getCurrentLocation(observer);
                    }
                    // location off
                    if (locationMode === this.diagnostic.locationMode.LOCATION_OFF) {
                      this.askForHighAccuracy().then(() => this.getCurrentLocation(observer), error => this.processError(observer, error));
                    } else {
                      // device only or battery saving, first try in this mode, after specified timeout, request the user to use high
                      // accuracy
                      this.geolocate.getCurrentPosition({ timeout: LOCATE_TIMEOUT_UNTIL_HIGH_ACC_REQUEST, maximumAge: LOCATE_MAXIMUM_AGE })
                        .then(pos => this.processComplete(observer, pos))
                        .catch(() => {
                          this.askForHighAccuracy().then(
                            () => this.getCurrentLocation(observer),
                            error => this.processError(observer, error)
                          );
                        });
                    }
                  });
                } else {
                  this.getCurrentLocation(observer);
                }
              } else {
                this.askForHighAccuracy().then(() => this.getCurrentLocation(observer), error => this.processError(observer, error));
              }
            }, error => this.processError(observer, error));
          });
        } else {
          this.getCurrentLocation(observer);
        }
      }
    });
  }

  private isGeolocationEnabled() {
    if (this.platform.is('cordova')) {
      this.diagnostic.isLocationEnabled().then((res) => {
        if (this.platform.is('android')) {
          this.diagnostic.isLocationAuthorized().then(locAuthorized => {
            if (locAuthorized) {
              this.diagnostic.getLocationMode().then(locMode => {
                switch (locMode) {
                  case this.diagnostic.locationMode.HIGH_ACCURACY:
                    this.setLocationMode(LocationStatus.HIGH_ACCURACY);
                    break;
                  case this.diagnostic.locationMode.BATTERY_SAVING:
                    this.setLocationMode(LocationStatus.BATTERY_SAVING);
                    break;
                  case this.diagnostic.locationMode.DEVICE_ONLY:
                    this.setLocationMode(LocationStatus.DEVICE_ONLY);
                    break;
                  case this.diagnostic.locationMode.LOCATION_OFF:
                    this.setLocationMode(LocationStatus.OFF);
                    break;
                }
              }, error => {
                console.error(`Error occured: ${error.message || error}`);
                this.setLocationMode(LocationStatus.OFF);
              });
            } else {
              console.log(`Set location status to denied`);
              this.setLocationMode(LocationStatus.DENIED);
            }
          });
        } else if (this.platform.is('ios') && res) {
          this.setLocationMode(LocationStatus.HIGH_ACCURACY);
        } else {
          this.setLocationMode(LocationStatus.OFF);
        }
      });
    } else {
      // in browser
      this.setLocationMode(LocationStatus.HIGH_ACCURACY);
    }
  }

  private setLocationMode(mode: LocationStatus) {
    this.locationStatus = mode;
    this.locationStatusReplay.next(this.locationStatus);
  }

  private getCurrentLocation(observer: Observer<Geoposition>) {
    this.geolocate.getCurrentPosition({ timeout: LOCATE_TIMEOUT_HIGH_ACCURACY, maximumAge: LOCATE_MAXIMUM_AGE, enableHighAccuracy: true })
      .then(pos => this.processComplete(observer, pos))
      .catch(error => this.processError(observer, error));
  }

  private processComplete(observer: Observer<Geoposition>, position: Geoposition) {
    observer.next(position);
    observer.complete();
  }

  private processError(observer: Observer<Geoposition>, error: PositionError) {
    // permission denied
    if (error.code === 1) { this.setLocationMode(LocationStatus.DENIED); }
    // position unavailable
    if (error.code === 2) { }
    // timeout
    if (error.code === 3) { }
    console.error(`Code: ${error.code}, Message ${error.message}`);
    // this.toast.create({ message: `Code: ${error.code}, Message ${error.message || error}`, duration: 3000 }).present();
    observer.error(error.message);
    observer.complete();
  }

  private subscribeToResume() {
    this.resumeSubscription = this.platform.resume.subscribe(() => this.isGeolocationEnabled());
  }

  private unsubscribeToResume() {
    if (this.resumeSubscription) { this.resumeSubscription.unsubscribe(); }
  }
}
