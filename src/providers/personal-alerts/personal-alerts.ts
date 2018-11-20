import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';
import { GeoSearch } from '@helgoland/map';
// import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { forkJoin, Observable, Observer } from 'rxjs';

import { BelaqiIndexProvider } from '../belaqi/belaqi';
import { NotificationPresenter, PersonalAlert } from '../notification-presenter/notification-presenter';
import { UserLocationListProvider } from '../user-location-list/user-location-list';

const DEFAULT_LOCAL_ALERT_UPDATE_IN_MINUTES = 60;
const DEFAULT_LOCAL_ALERT_UPDATE_LEVEL = 5;
const DEFAULT_LOCAL_ALERT_UPDATE_SENSITIVE = false;

const MINUTE_IN_MILLIS = 60000;

const LOCALSTORAGE_INDEX_ALERT_ACTIVE = 'personal.alert.active';
const LOCALSTORAGE_INDEX_ALERT_PERIOD = 'personal.alert.period';
const LOCALSTORAGE_INDEX_ALERT_LEVEL = 'personal.alert.level';
const LOCALSTORAGE_INDEX_ALERT_SENSITIVE = 'personal.alert.sensitive';

/**
 * Problem with Android 8:
 *  - https://github.com/katzer/cordova-plugin-background-mode/issues/380
 *  - https://github.com/katzer/cordova-plugin-background-mode/issues/320
 */
@Injectable()
export class PersonalAlertsProvider {

  private interval: NodeJS.Timer;

  constructor(
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
    // private backgroundGeolocation: BackgroundGeolocation,
    private localStorage: LocalStorage,
    private presenter: NotificationPresenter,
    private userLocations: UserLocationListProvider,
    private belaqiProvider: BelaqiIndexProvider,
    private platform: Platform,
    private geosearch: GeoSearch,
    private translateSrvc: TranslateService
  ) { }

  public init() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.localNotifications.on('click').subscribe((notification: ILocalNotification) => {
          const personalAlert = notification.data as PersonalAlert[];
          this.presenter.presentPersonalAlerts(personalAlert);
        });
      }

      if (this.isActive()) {
        this.activate();
      }
    })
  }

  public isActive(): boolean {
    return this.localStorage.load<boolean>(LOCALSTORAGE_INDEX_ALERT_ACTIVE) || false;
  }

  public activate() {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_ACTIVE, true);

    // this.localNotifications.schedule({ text: 'Activate personal alerts' });

    this.platform.ready().then(() => {

      if (this.platform.is('cordova')) {
        this.backgroundMode.on('activate').subscribe(res => {
          // this.backgroundMode.disableWebViewOptimizations();
          // this.localNotifications.schedule({ text: 'Start BackgroundMode - min: ' + this.getPeriod() + ', level: ' + this.getLevel() });
          this.interval = setInterval(this.runAlertTask, this.getPeriod() * MINUTE_IN_MILLIS);
        });

        this.backgroundMode.on('deactivate').subscribe(res => {
          if (this.interval) { clearInterval(this.interval); }
          this.interval = null;
        });

        this.translateSrvc.onLangChange.subscribe(res => this.setBackgroundModeInformations());
        if (this.translateSrvc.currentLang) { this.setBackgroundModeInformations() };

        this.backgroundMode.enable();
      }
    });

  }

  private setBackgroundModeInformations() {
    this.backgroundMode.setDefaults({
      silent: false,
      text: this.translateSrvc.instant('personal-alerts.background-service.hint'),
      title: this.translateSrvc.instant('personal-alerts.background-service.title')
    });
  }

  public deactivate() {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_ACTIVE, false);
    if (this.interval) {
      // this.backgroundGeolocation.finish();
      this.backgroundMode.disable();
      clearInterval(this.interval);
    }
  }

  public setPeriod(minutes: number) {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_PERIOD, minutes);
  }

  public getPeriod(): number {
    return this.localStorage.load<number>(LOCALSTORAGE_INDEX_ALERT_PERIOD) || DEFAULT_LOCAL_ALERT_UPDATE_IN_MINUTES
  }

  public setLevel(level: number) {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_LEVEL, level);
  }

  public getLevel(): number {
    return this.localStorage.load<number>(LOCALSTORAGE_INDEX_ALERT_LEVEL) || DEFAULT_LOCAL_ALERT_UPDATE_LEVEL
  }

  public setSensitive(sensitive: boolean) {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_SENSITIVE, sensitive);
  }

  public getSensitive(): boolean {
    return this.localStorage.load<boolean>(LOCALSTORAGE_INDEX_ALERT_SENSITIVE) || DEFAULT_LOCAL_ALERT_UPDATE_SENSITIVE
  }

  runAlertTask = () => {
    // this.localNotifications.schedule({ text: 'Starting task ...' });
    const request = [];
    // request.push(this.doCurrentLocationCheck());
    request.push(this.doUserLocationsCheck());

    forkJoin(request).subscribe(res => {
      const alerts = [];
      res.forEach(e => {
        if (e instanceof Array) {
          alerts.push(...e);
        } else if (e) {
          alerts.push(e);
        }
      });
      this.notifyAlerts(alerts);
    }, error => {
      this.localNotifications.schedule({ text: 'Error while tasking: ' + error, id: 200 });
    });
  }

  private doUserLocationsCheck(): Observable<PersonalAlert[]> {
    // this.localNotifications.schedule({ text: `User locations check` });
    return new Observable<PersonalAlert[]>((observer: Observer<PersonalAlert[]>) => {
      this.userLocations.getUserLocations().subscribe(res => {
        // this.localNotifications.schedule({ text: `Has user locations: ${res}` });
        const requests = [];
        const alerts: PersonalAlert[] = [];
        res.forEach(loc => {
          if (loc.type === 'user') {
            requests.push(this.belaqiProvider.getValue(loc.latitude, loc.longitude)
              .do(res => {
                if (this.getLevel() <= res) {
                  alerts.push({
                    belaqi: res,
                    locationLabel: loc.label,
                    sensitive: this.getSensitive()
                  })
                }
              })
            );
          }
        });

        forkJoin(requests).subscribe(() => {
          // this.localNotifications.schedule({ text: `User locations results: ${alerts}` });
          observer.next(alerts);
          observer.complete();
        });
      }).unsubscribe();
    });
  }

  private notifyAlerts(alerts: PersonalAlert[]) {
    if (alerts.length > 0) {
      if (this.platform.is('cordova') && this.backgroundMode.isActive()) {
        this.localNotifications.schedule({
          id: new Date().getTime(),
          text: `${alerts.length} Alerts at ${new Date().toLocaleTimeString()}`,
          title: 'Personal alerts for your locations',
          // smallIcon: 'res://fcm_push_icon',
          // group: 'notify',
          data: alerts
        });
      } else {
        this.presenter.presentPersonalAlerts(alerts);
      }
    }
  }

  // private doCurrentLocationCheck(): Observable<PersonalAlert> {
  //   this.localNotifications.schedule({ text: 'Start geolocation task' + this.getPeriod(), id: 200 });
  //   return new Observable<PersonalAlert>((observer: Observer<PersonalAlert>) => {
  //     const config: BackgroundGeolocationConfig = {
  //       desiredAccuracy: 1000,
  //       stationaryRadius: 20,
  //       distanceFilter: 30,
  //       debug: false,
  //       stopOnTerminate: true,
  //       notificationTitle: 'Background works',
  //       notificationText: 'Determine location and air quality'
  //       // notificationIconLarge: 'res://fcm_push_icon',
  //       // notificationIconSmall: 'res://fcm_push_icon'
  //     };
  //     if (this.platform.is('cordova')) {
  //       this.backgroundGeolocation.configure(config)
  //         .subscribe(
  //           (location: BackgroundGeolocationResponse) => {
  //             if (location) {
  //               location.latitude = 51.05;
  //               location.longitude = 3.7;
  //             }
  //             this.localNotifications.schedule({ text: 'geolocation: ' + location.latitude + ' ' + location.longitude, id: 500 });
  //             if (location) {
  //               forkJoin(
  //                 this.belaqiProvider.getValue(location.latitude, location.longitude),
  //                 this.geosearch.reverse({ type: 'Point', coordinates: [location.latitude, location.longitude] })
  //               ).subscribe(res => {
  //                 const belaqi = res[0] ? res[0] : null;
  //                 const label = this.createGeoLabel(res[1]);
  //                 // this.localNotifications.schedule({ text: `Index: ${belaqi} at ${label}`, id: 600 });
  //                 if (belaqi && label) {
  //                   observer.next({
  //                     belaqi,
  //                     locationLabel: label,
  //                     sensitive: this.getSensitive()
  //                   })
  //                   observer.complete();
  //                 } else {
  //                   observer.next(null);
  //                   observer.complete();
  //                 }
  //               }, error => {
  //                 this.localNotifications.schedule({ text: 'geolocation error: ' + error.toString(), id: 600 });
  //                 observer.error(error);
  //               });
  //             } else {
  //               observer.next(null);
  //               observer.complete();
  //             }
  //             this.backgroundGeolocation.stop();
  //           }, (error) => {
  //             observer.error(error);
  //             this.localNotifications.schedule({ text: 'geolocation error ' + error })
  //           });
  //       this.backgroundGeolocation.start();
  //     } else {
  //       observer.next(null);
  //       observer.complete();
  //     }
  //   });
  // }

  // private createGeoLabel(geo: GeoReverseResult) {
  //   let locationLabel;
  //   if (geo && geo.address && geo.address.road && geo.address.houseNumber && geo.address.city) {
  //     if (geo.address.road && geo.address.houseNumber) { locationLabel = `${geo.address.road} ${geo.address.houseNumber}, `; }
  //     if (geo.address.city) { locationLabel += geo.address.city + ', ' }
  //     if (geo.address.country) { locationLabel += geo.address.country }
  //   } else {
  //     locationLabel = this.translateSrvc.instant('belaqi-user-location-slider.current-location');
  //   }
  //   return locationLabel;
  // }

}
