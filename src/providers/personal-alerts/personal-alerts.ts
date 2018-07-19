import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';
import { GeoSearch } from '@helgoland/map';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
} from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
import { forkJoin, Observable, Observer } from 'rxjs';

import { BelaqiIndexProvider } from '../belaqi/belaqi';
import { NotificationPresenter, PersonalAlert } from '../notification-presenter/notification-presenter';
import { UserLocationListProvider } from '../user-location-list/user-location-list';

const DEFAULT_LOCAL_ALERT_UPDATE_IN_MINUTES = 60;
const DEFAULT_LOCAL_ALERT_UPDATE_LEVEL = 1;
const DEFAULT_LOCAL_ALERT_UPDATE_SENSITIVE = false;

const LOCALSTORAGE_INDEX_ALERT_ACTIVE = 'personal.alert.active';
const LOCALSTORAGE_INDEX_ALERT_PERIOD = 'personal.alert.period';
const LOCALSTORAGE_INDEX_ALERT_LEVEL = 'personal.alert.level';
const LOCALSTORAGE_INDEX_ALERT_SENSITIVE = 'personal.alert.sensitive';

@Injectable()
export class PersonalAlertsProvider {

  private timeout: NodeJS.Timer;

  constructor(
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
    private backgroundGeolocation: BackgroundGeolocation,
    private localStorage: LocalStorage,
    private presenter: NotificationPresenter,
    private userLocations: UserLocationListProvider,
    private belaqiProvider: BelaqiIndexProvider,
    private platform: Platform,
    private geosearch: GeoSearch
  ) { }

  public init() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.localNotifications.on('click').subscribe((notification: ILocalNotification) => {
          const temp = notification.data as PersonalAlert[];
          this.presenter.presentPersonalAlerts(temp);
        });
      }
    })
    setTimeout(() => {
      this.runAlertTask();
    }, 3000);

    // setTimeout(() => {
    //   this.requestModelledValue({
    //     accuracy: 0,
    //     altitude: 0,
    //     altitudeAccuracy: 0,
    //     bearing: 0,
    //     coords: {
    //       accuracy: 0,
    //       altitude: 0,
    //       altitudeAccuracy: 0,
    //       heading: 0,
    //       latitude: 0,
    //       longitude: 0,
    //       speed: 0
    //     },
    //     debug: true,
    //     latitude: 50.863892,
    //     longitude: 4.6337528,
    //     locationId: 1234566,
    //     serviceProvider: 'gps',
    //     speed: 12,
    //     time: 12352353456,
    //     timestamp: 23453245
    //   });
    // }, 3000);
  }

  public isActive(): boolean {
    return this.localStorage.load<boolean>(LOCALSTORAGE_INDEX_ALERT_ACTIVE) || false;
  }

  public activate() {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_ACTIVE, true);
    this.backgroundMode.enable();
    this.backgroundMode.setDefaults({
      silent: false,
      text: '',
      title: 'The app is active in the background.',
      icon: 'fcm_push_icon'
    });
    this.runAlertTask();
    this.startNewTimeout();
  }

  public deactivate() {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_ACTIVE, false);
    if (this.timeout) {
      this.backgroundGeolocation.finish();
      this.backgroundMode.disable();
      clearTimeout(this.timeout);
    }
  }

  public setPeriod(minutes: number) {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_PERIOD, minutes);
    this.startNewTimeout();
  }

  public getPeriod(): number {
    return this.localStorage.load<number>(LOCALSTORAGE_INDEX_ALERT_PERIOD) || DEFAULT_LOCAL_ALERT_UPDATE_IN_MINUTES
  }

  public setLevel(level: number) {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_LEVEL, level);
    this.startNewTimeout();
  }

  public getLevel(): number {
    return this.localStorage.load<number>(LOCALSTORAGE_INDEX_ALERT_LEVEL) || DEFAULT_LOCAL_ALERT_UPDATE_LEVEL
  }

  public setSensitive(sensitive: boolean) {
    this.localStorage.save(LOCALSTORAGE_INDEX_ALERT_SENSITIVE, sensitive);
    this.startNewTimeout();
  }

  public getSensitive(): boolean {
    return this.localStorage.load<boolean>(LOCALSTORAGE_INDEX_ALERT_SENSITIVE) || DEFAULT_LOCAL_ALERT_UPDATE_SENSITIVE
  }

  private startNewTimeout() {
    if (this.timeout) { clearTimeout(this.timeout) };
    this.timeout = setTimeout(() => this.runAlertTask(), this.getPeriod() * 60000);
  }

  private runAlertTask() {
    const request = [];
    request.push(this.doCurrentLocationCheck());
    request.push(this.doUserLocationsCheck());

    forkJoin(request).subscribe(res => {
      const alerts = [];
      res.forEach(e => {
        debugger;
        if (e instanceof Array) {
          alerts.push(...e);
        } else if (e) {
          alerts.push(e);
        }
      });
      this.notifyAlerts(alerts);
    });

    this.startNewTimeout();
  }

  private doCurrentLocationCheck(): Observable<PersonalAlert> {

    return new Observable<PersonalAlert>((observer: Observer<PersonalAlert>) => {
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: false,
        stopOnTerminate: true,
        notificationTitle: 'Background works',
        notificationText: 'Determine location and air quality'
        // notificationIconLarge: 'res://fcm_push_icon',
        // notificationIconSmall: 'res://fcm_push_icon'
      };
      if (this.platform.is('cordova')) {
        this.backgroundGeolocation.configure(config)
          .subscribe((location: BackgroundGeolocationResponse) => {
            if (location) {
              // TODO remove after tests
              location.latitude = 50.863892;
              location.longitude = 4.6337528;
              forkJoin(
                this.belaqiProvider.getValue(location.latitude, location.longitude),
                this.geosearch.reverse({ type: 'Point', coordinates: [] }, {})
              ).subscribe(res => {
                const belaqi = res[0] ? res[0] : null;
                const label = (res[1] && res[1].displayName) ? res[1].displayName : 'Current location';
                if (belaqi && label) {
                  observer.next({
                    belaqi,
                    locationLabel: label,
                    sensitive: this.getSensitive()
                  })
                  observer.complete();
                } else {
                  observer.next(null);
                  observer.complete();
                }
              });
            } else {
              observer.next(null);
              observer.complete();
            }
            this.backgroundGeolocation.stop();
          }, (error) => {
            observer.error(error);
          });
        this.backgroundGeolocation.start();
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }

  private doUserLocationsCheck(): Observable<PersonalAlert[]> {
    return new Observable<PersonalAlert[]>((observer: Observer<PersonalAlert[]>) => {
      const requests = [];
      const alerts: PersonalAlert[] = [];
      this.userLocations.getLocations().forEach(loc => {
        requests.push(this.belaqiProvider.getValue(loc.point.coordinates[1], loc.point.coordinates[0]).do(res => {
          if (this.getLevel() <= res) {
            alerts.push({
              belaqi: res,
              locationLabel: loc.label,
              sensitive: this.getSensitive()
            })
          }
        }));
      })
      forkJoin(requests).subscribe(() => {
        observer.next(alerts);
        observer.complete()
      });
    });
  }

  private notifyAlerts(alerts: PersonalAlert[]) {
    if (this.backgroundMode.isActive()) {
      this.localNotifications.schedule({
        id: 1,
        text: 'Checked at: ' + new Date().toLocaleTimeString(),
        title: 'Personal alerts for your locations',
        smallIcon: 'res://fcm_push_icon',
        group: 'notify',
        data: alerts
      });
    } else {
      this.presenter.presentPersonalAlerts(alerts);
    }
  }
}
