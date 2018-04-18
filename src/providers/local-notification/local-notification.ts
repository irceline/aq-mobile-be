import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { AqIndex } from '../aq-index/aq-index';
import { IrcelineSettingsProvider } from '../irceline-settings/irceline-settings';

const LOCAL_NOTIFICATION_UPDATE_IN_MINUTES = 10;

@Injectable()
export class AqIndexNotifications {

  private interval: NodeJS.Timer;

  constructor(
    private localNotifications: LocalNotifications,
    private aqIndex: AqIndex,
    private ircelineSettings: IrcelineSettingsProvider,
    private geolocation: Geolocation,
    private backgroundMode: BackgroundMode
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
      this.backgroundMode.disable();
      clearInterval(this.interval);
    }
  }

  private doCheck() {
    console.log('DoCheck started.');
    this.ircelineSettings.getSettings().subscribe(ircelineConfig => {
      this.aqIndex.getIndex(50.863892, 4.6337528, ircelineConfig.lastupdate).subscribe(res => {
        console.log('Get Index with value: ' + res);
        const date = new Date();
        this.localNotifications.schedule({
          id: 1,
          text: 'At: ' + date.toTimeString() + ' with Value: ' + res,
          title: 'Irceline Index Notification at: ' + date.toDateString(),
          smallIcon: 'res://fcm_push_icon'
        })
      }, error => console.error(error));
    })

    this.geolocation.getCurrentPosition({
      timeout: 20000,
      enableHighAccuracy: true
    }).then(resp => {
      const date = new Date();
      if (resp && resp.coords && resp.coords.longitude && resp.coords.latitude) {
        this.localNotifications.schedule({
          id: 2,
          text: 'Longitude: ' + resp.coords.longitude + ' / Latitude: ' + resp.coords.latitude,
          title: 'Geolocation at: ' + date.toTimeString(),
          smallIcon: 'res://fcm_push_icon'
        })
      } else {
        this.localNotifications.schedule({
          id: 2,
          text: 'Get no full response.',
          title: 'Error on Geolocation at: ' + date.toTimeString(),
          smallIcon: 'res://fcm_push_icon'
        })
      }
    }, error => {
      this.localNotifications.schedule({
        id: 2,
        text: JSON.stringify(error),
        title: 'Error on Geolocation at: ' + new Date().toTimeString(),
        smallIcon: 'res://fcm_push_icon'
      })
    });

  }

}
