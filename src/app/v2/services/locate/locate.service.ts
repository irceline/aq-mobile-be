import { Injectable, OnInit } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer, ReplaySubject } from 'rxjs';

export const enum LocationStatus {
  HIGH_ACCURACY = 'HIGH_ACCURACY',
  BATTERY_SAVING = 'BATTERY_SAVING',
  DEVICE_ONLY = 'DEVICE_ONLY',
  OFF = 'OFF',
  DENIED = 'DENIED'
}

const LOCATE_MAXIMUM_AGE = 0; // 5 minutes
const LOCATE_TIMEOUT_HIGH_ACCURACY = 1000 * 30; // 30 seconds
const LOCATE_TIMEOUT_UNTIL_HIGH_ACC_REQUEST = 1000 * 10; // 10 seconds

@Injectable(
  { providedIn: 'root' }
)
export class LocateService implements OnInit {

  private locationStatusReplay: ReplaySubject<LocationStatus> = new ReplaySubject(1);
  private locationStatus: LocationStatus;

  private resumeSubscription;

  constructor(
    private platform: Platform,
    private geolocate: Geolocation,
    private diagnostic: Diagnostic,
    private translate: TranslateService,
    private toast: ToastController,
    private locationAccuracy: LocationAccuracy
  ) {
  }

  public ngOnInit() {
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
    if (!this.locationStatus) {
      this.isGeolocationEnabled().then((status) => {
        return status;
      });
    } else {
      return this.locationStatus;
    }
  }

  public askForPermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.diagnostic.isLocationAuthorized()
        .then(auth => {
          if (auth) {
            resolve(true);
          } else {
            this.diagnostic.getLocationAuthorizationStatus()
              .then(status => {
                if (status === 'DENIED_ALWAYS') {
                  resolve(false);
                } else {
                  this.diagnostic.requestLocationAuthorization()
                    .then(res => {
                      if (res === 'DENIED_ONCE' || res === 'DENIED_ALWAYS' || res === 'DENIED') {
                        resolve(false);
                      } else {
                        resolve(true);
                      }
                    })
                    .catch(error => reject(error));
                }
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
          if (!res) {
            this.toast.create({ message: this.translate.instant('network.geolocationDisabled'), duration: 5000 })
              .then(toast => toast.present());
          }
        });
      });
    }
  }

  public getUserLocation(askForPermission?: boolean): Observable<Geoposition> {
    return new Observable((observer: Observer<Geoposition>) => {
      if (this.locationStatus !== LocationStatus.DENIED || askForPermission) {
        if (this.platform.is('cordova')) {
          this.platform.ready().then(() => {
            this.diagnostic.isLocationEnabled().then(enabled => {
              if (enabled) {
                if (this.platform.is('android')) {
                  this.askForPermission().then(permissionGranted => {
                    if (permissionGranted) {
                      this.diagnostic.getLocationMode().then(locationMode => {
                        // high accuracy => do locate
                        if (locationMode === this.diagnostic.locationMode.HIGH_ACCURACY) {
                          this.getCurrentLocation(observer);
                        }
                        // location off
                        if (locationMode === this.diagnostic.locationMode.LOCATION_OFF) {
                          this.askForHighAccuracy().then(
                            () => this.getCurrentLocation(observer),
                            error => this.processError(observer, error)
                          );
                        } else {
                          // device only or battery saving, first try in this mode, after specified timeout, request the user to use high
                          // accuracy
                          this.geolocate.getCurrentPosition({
                            timeout: LOCATE_TIMEOUT_UNTIL_HIGH_ACC_REQUEST,
                            maximumAge: LOCATE_MAXIMUM_AGE
                          })
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
                      this.processError(observer, { code: 52, message: 'Permission denied!' });
                    }
                  });
                } else if (this.platform.is('ios')) {
                  this.diagnostic.isLocationAuthorized().then(locAuthorized => {
                    if (locAuthorized) {
                      this.getCurrentLocation(observer);
                    } else {
                      try {
                        this.diagnostic.getLocationAuthorizationStatus().then(status => {
                          switch (status) {
                            case this.diagnostic.permissionStatus.NOT_REQUESTED:
                              console.log('Permission not requested');
                              this.diagnostic.requestLocationAuthorization().then(permissionStatus => {
                                switch (permissionStatus) {
                                  case this.diagnostic.permissionStatus.NOT_REQUESTED:
                                    // This should never happen as we just requested Authorization.
                                    console.log('Permission not requested');
                                    break;
                                  case this.diagnostic.permissionStatus.DENIED:
                                    console.log('Permission denied');
                                    this.processErrorString(observer, 'Permission denied');
                                    break;
                                  case this.diagnostic.permissionStatus.GRANTED:
                                  case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                                    console.log('Permission granted');
                                    this.getCurrentLocation(observer);
                                    break;
                                }
                              })
                              break;
                            case this.diagnostic.permissionStatus.DENIED:
                              this.toast.create({
                                message: this.translate.instant('network.geolocationDenied'),
                                duration: 5000
                              }).then(toast => toast.present());
                              observer.error('Permission denied');
                              observer.complete();
                              break;
                            case this.diagnostic.permissionStatus.GRANTED:
                            case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                              this.getCurrentLocation(observer);
                              break;
                          }
                        }).catch(error => console.log(`Error occured ${JSON.stringify(error)}`));
                      } catch (e) {
                        console.log(`Error occured ${JSON.stringify(e)}`)
                      }
                    }
                  })
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

  private async isGeolocationEnabled(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.diagnostic.isLocationEnabled().then((res) => {
          if (this.platform.is('android')) {
            this.diagnostic.isLocationAuthorized().then(locAuthorized => {
              if (locAuthorized) {
                this.diagnostic.getLocationMode().then(locMode => {
                  switch (locMode) {
                    case this.diagnostic.locationMode.HIGH_ACCURACY:
                      this.setLocationMode(LocationStatus.HIGH_ACCURACY);
                      resolve(LocationStatus.HIGH_ACCURACY);
                      break;
                    case this.diagnostic.locationMode.BATTERY_SAVING:
                      this.setLocationMode(LocationStatus.BATTERY_SAVING);
                      resolve(LocationStatus.BATTERY_SAVING);
                      break;
                    case this.diagnostic.locationMode.DEVICE_ONLY:
                      this.setLocationMode(LocationStatus.DEVICE_ONLY);
                      resolve(LocationStatus.DEVICE_ONLY);
                      break;
                    case this.diagnostic.locationMode.LOCATION_OFF:
                      this.setLocationMode(LocationStatus.OFF);
                      resolve(LocationStatus.OFF);
                      break;
                  }
                }, error => {
                  console.error(`Error occured: ${error.message || error}`);
                  this.setLocationMode(LocationStatus.OFF);
                  resolve(LocationStatus.OFF);
                });
              } else {
                console.log(`Set location status to denied`);
                this.setLocationMode(LocationStatus.DENIED);
                resolve(LocationStatus.DENIED);
              }
            });
          } else if (this.platform.is('ios')) {
            console.log(`ios try to get geolocation`);
            this.setLocationMode(LocationStatus.HIGH_ACCURACY);
            resolve(LocationStatus.HIGH_ACCURACY);
          } else {
            this.setLocationMode(LocationStatus.OFF);
            resolve(LocationStatus.OFF);
          }
        });
      } else {
        // in browser
        this.setLocationMode(LocationStatus.HIGH_ACCURACY);
        resolve(LocationStatus.HIGH_ACCURACY);
      }
    });
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
    if (error && error.code && error.message) {
      // permission denied
      if (error.code === 1) { this.setLocationMode(LocationStatus.DENIED); }
      // position unavailable
      if (error.code === 2) { }
      // timeout
      if (error.code === 3) { }
      console.error(`Error while gathering location. Error-Code: ${error.code}, Error-Message: ${error.message}`);
      this.toast.create({
        message: `Code: ${error.code}, Error: ${error.message || error}`,
        duration: 3000
      }).then(toast => toast.present());
      observer.error(error.message);
    } else {
      console.error(`Error while gathering location: ${error}`);
      this.toast.create({ message: `Error: ${error}`, duration: 3000 }).then(toast => toast.present());
      observer.error(error);
    }
    observer.complete();
  }

  private processErrorString(observer: Observer<Geoposition>, error: string) {
    console.error(`Error while gathering location: ${error}`);
    this.toast.create({ message: `Error: ${error}`, duration: 3000 }).then(toast => toast.present());
    observer.error(error);
    observer.complete();
  }

  private subscribeToResume() {
    this.resumeSubscription = this.platform.resume.subscribe(() => this.isGeolocationEnabled());
  }

  private unsubscribeToResume() {
    if (this.resumeSubscription) { this.resumeSubscription.unsubscribe(); }
  }
}