import { Injectable } from '@angular/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
} from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { AqIndex } from '../aq-index/aq-index';
import { IrcelineSettingsProvider } from '../irceline-settings/irceline-settings';

const LOCAL_NOTIFICATION_UPDATE_IN_MINUTES = 1;

@Injectable()
export class AqIndexNotifications {

  private interval: NodeJS.Timer;

  constructor(
    private localNotifications: LocalNotifications,
    private aqIndex: AqIndex,
    private ircelineSettings: IrcelineSettingsProvider,
    private geolocation: Geolocation,
    private backgroundMode: BackgroundMode,
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    console.log('AqIndexNotifications started.');
  }

  public activate() {
    this.backgroundMode.enable();
    this.backgroundMode.setDefaults({
      silent: false,
      text: '',
      title: 'The app is active in the background.',
      icon: 'fcm_push_icon'
    });
    this.doCheck();
    this.interval = setInterval(() => this.doCheck(), LOCAL_NOTIFICATION_UPDATE_IN_MINUTES * 60000);
  }

  public deactivate() {
    if (this.interval) {
      this.backgroundGeolocation.finish();
      this.backgroundMode.disable();
      clearInterval(this.interval);
    }
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

    // https://forum.ionicframework.com/t/ionic-geolocation-woes/2471/13
    // https://www.gajotres.net/ionic-2-having-fun-with-cordova-geolocation-plugin/2/
    // https://github.com/louisbl/cordova-plugin-locationservices
    // https://ionicframework.com/docs/native/background-geolocation/
    // https://www.joshmorony.com/adding-background-geolocation-to-an-ionic-2-application/

    // TODO Probleme zwischen FCM-Plugin und BackgroundGeolocation-Plugin

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
          // } else {
          //   this.localNotifications.schedule({
          //     id: 2,
          //     text: 'Get no full response.',
          //     title: 'Error on Geolocation at: ' + new Date().toTimeString(),
          //     smallIcon: 'res://fcm_push_icon'
          //   })
        }
        this.backgroundGeolocation.stop();
      });

    // start recording location
    this.backgroundGeolocation.start();
  }

}
