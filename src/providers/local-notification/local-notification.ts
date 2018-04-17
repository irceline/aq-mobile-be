import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { AqIndex } from '../aq-index/aq-index';
import { IrcelineSettingsProvider } from '../irceline-settings/irceline-settings';

@Injectable()
export class AqIndexNotifications {

  private interval: NodeJS.Timer;

  constructor(
    private localNotifications: LocalNotifications,
    private aqIndex: AqIndex,
    private ircelineSettings: IrcelineSettingsProvider,
    private geolocation: Geolocation
  ) {
    console.log('AqIndexNotifications started.');
  }

  public activate() {
    this.doCheck();
    this.interval = setInterval(() => this.doCheck(), 10000);
  }

  public deactivate() {
    if (this.interval) {
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
          priority: 2
        })
      }, error => console.error(error));
    })

    this.geolocation.getCurrentPosition().then(resp => {
      const date = new Date();
      if (resp && resp.coords && resp.coords.longitude && resp.coords.latitude) {
        this.localNotifications.schedule({
          id: 2,
          text: 'Longitude: ' + resp.coords.longitude + ' / Latitude: ' + resp.coords.latitude,
          title: 'Geolocation at: ' + date.toTimeString(),
        })
      } else {
        this.localNotifications.schedule({
          id: 2,
          text: '',
          title: 'Error on Geolocation at: ' + date.toTimeString(),
        })
      }
    }, error => {
      this.localNotifications.schedule({
        id: 2,
        text: JSON.stringify(error),
        title: 'Error on Geolocation at: ' + new Date().toTimeString(),
      })
    });

  }

}
