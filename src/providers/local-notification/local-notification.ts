import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
} from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';

import { ModelledValueProvider } from '../aq-index/aq-index';
import { IrcelineSettingsProvider } from '../irceline-settings/irceline-settings';
import { LocatedValueNotification, NotificationPresenter } from '../notification-presenter/notification-presenter';

const DEFAULT_LOCAL_NOTIFICATION_UPDATE_IN_MINUTES = 60;

const LOCALSTORAGE_INDEX_NOTIFICATION_ACTIVE = 'index.notification.active'
const LOCALSTORAGE_INDEX_NOTIFICATION_PERIOD = 'index.notification.period'

@Injectable()
export class LocalNotificationsProvider {

  private timeout: NodeJS.Timer;

  constructor(
    private localNotifications: LocalNotifications,
    private modelledValue: ModelledValueProvider,
    private ircelineSettings: IrcelineSettingsProvider,
    private backgroundMode: BackgroundMode,
    private backgroundGeolocation: BackgroundGeolocation,
    private localStorage: LocalStorage,
    private presenter: NotificationPresenter,
    private platform: Platform
  ) { }

  public init() {
    this.platform.ready().then((ready) => {
      if (this.platform.is('cordova')) {
        this.localNotifications.on('click').subscribe((notification: ILocalNotification) => {
          const temp = notification.data as LocatedValueNotification;
          this.presenter.presentLocatedValueNotification(temp);
        });
      }
    })
  }

  public isActive(): boolean {
    return this.localStorage.load<boolean>(LOCALSTORAGE_INDEX_NOTIFICATION_ACTIVE) || false;
  }

  public getPeriod(): number {
    return this.localStorage.load<number>(LOCALSTORAGE_INDEX_NOTIFICATION_PERIOD) || DEFAULT_LOCAL_NOTIFICATION_UPDATE_IN_MINUTES
  }

  public activate() {
    this.localStorage.save(LOCALSTORAGE_INDEX_NOTIFICATION_ACTIVE, true);
    this.backgroundMode.enable();
    this.backgroundMode.setDefaults({
      silent: false,
      text: '',
      title: 'The app is active in the background.',
      icon: 'fcm_push_icon'
    });
    this.runNotificationTask();
    this.startNewTimeout();
  }

  public deactivate() {
    this.localStorage.save(LOCALSTORAGE_INDEX_NOTIFICATION_ACTIVE, false);
    if (this.timeout) {
      this.backgroundGeolocation.finish();
      this.backgroundMode.disable();
      clearTimeout(this.timeout);
    }
  }

  public setPeriod(minutes: number) {
    this.localStorage.save(LOCALSTORAGE_INDEX_NOTIFICATION_PERIOD, minutes);
    this.startNewTimeout();
  }

  private startNewTimeout() {
    if (this.timeout) { clearTimeout(this.timeout) };
    this.timeout = setTimeout(() => this.runNotificationTask(), this.getPeriod() * 60000);
  }

  private runNotificationTask() {

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

    this.backgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        if (location) {
          // location.latitude = 50.863892;
          // location.longitude = 4.6337528;
          this.requestModelledValue(location);
        } else {
          this.localNotifications.schedule({
            id: 2,
            text: 'Get no full response.',
            title: 'Error on Geolocation at: ' + new Date().toTimeString(),
            smallIcon: 'res://fcm_push_icon'
          })
        }
        this.startNewTimeout();
        this.backgroundGeolocation.stop();
      });
    this.backgroundGeolocation.start();
  }


  private requestModelledValue(location: BackgroundGeolocationResponse) {
    this.ircelineSettings.getSettings().subscribe(ircelineConfig => {
      this.modelledValue.getIndex(location.latitude, location.longitude, ircelineConfig.lastupdate)
        .subscribe(
          value => {
            this.notifyValue(new Date(), location, value);
          },
          error => {
            this.notifyValue(new Date(), location, 99999);
          });
    });
  }

  private notifyValue(date: Date, location: BackgroundGeolocationResponse, value: number) {
    const notificationData: LocatedValueNotification = {
      latitude: location.latitude,
      longitude: location.longitude,
      value,
      date
    };
    if (this.backgroundMode.isActive()) {
      this.localNotifications.schedule({
        id: 1,
        text: 'At: ' + date.toTimeString() + ' with Value: ' + value,
        title: 'Irceline Index Notification at: ' + date.toDateString(),
        smallIcon: 'res://fcm_push_icon',
        group: 'notify',
        data: notificationData
      });
    } else {
      this.presenter.presentLocatedValueNotification(notificationData);
    }
  }
}
