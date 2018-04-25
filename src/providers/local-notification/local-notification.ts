import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
} from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';

const DEFAULT_LOCAL_NOTIFICATION_UPDATE_IN_MINUTES = 60;

const LOCALSTORAGE_INDEX_NOTIFICATION_ACTIVE = 'index.notification.active'
const LOCALSTORAGE_INDEX_NOTIFICATION_PERIOD = 'index.notification.period'

@Injectable()
export class AqIndexNotifications {

  private timeout: NodeJS.Timer;

  constructor(
    private localNotifications: LocalNotifications,
    // private aqIndex: AqIndex,
    // private ircelineSettings: IrcelineSettingsProvider,
    private backgroundMode: BackgroundMode,
    private backgroundGeolocation: BackgroundGeolocation,
    private localStorage: LocalStorage
  ) { }

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
    this.doCheck();
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
    this.timeout = setTimeout(() => this.doCheck(), this.getPeriod() * 60000);
  }

  private doCheck() {
    console.log('DoCheck started.');
    // this.ircelineSettings.getSettings().subscribe(ircelineConfig => {
    //   this.aqIndex.getIndex(50.863892, 4.6337528, ircelineConfig.lastupdate).subscribe(res => {
    //     console.log('Get Index with value: ' + res);
    //     const date = new Date();
    //     this.localNotifications.schedule({
    //       id: 1,
    //       text: 'At: ' + date.toTimeString() + ' with Value: ' + res,
    //       title: 'Irceline Index Notification at: ' + date.toDateString(),
    //       smallIcon: 'res://fcm_push_icon'
    //     })
    //   }, error => console.error(error));
    // })

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

        console.log(location);

        if (location) {
          this.localNotifications.schedule({
            id: 2,
            text: 'Longitude: ' + location.longitude + ' / Latitude: ' + location.latitude,
            title: 'Background-Geolocation at: ' + new Date(location.time).toTimeString(),
            smallIcon: 'res://fcm_push_icon'
          })
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

    // start recording location
    this.backgroundGeolocation.start();
  }

}
