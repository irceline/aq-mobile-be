import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { AqIndexNotifications } from '../../../providers/local-notification/local-notification';
import { LocalNotification, MobileSettings } from '../../../providers/settings/settings';

@Component({
  selector: 'local-notification-settings',
  templateUrl: 'local-notification-settings.html'
})
export class LocalNotificationSettingsComponent {

  public indexNotification: boolean;
  public notificationSettings: LocalNotification[];
  public currentLocalNotification: LocalNotification;
  public currentPeriod: number;

  constructor(
    private settings: SettingsService<MobileSettings>,
    private aqIndexNotif: AqIndexNotifications,
    private translate: TranslateService
  ) {
    this.indexNotification = this.aqIndexNotif.isActive();
    this.currentPeriod = this.aqIndexNotif.getPeriod();
    this.notificationSettings = this.settings.getSettings().localnotifications;
  }

  public updateIndexNotifications() {
    if (this.indexNotification) {
      this.aqIndexNotif.activate();
    } else {
      this.aqIndexNotif.deactivate();
    }
  }

  public setLocalNotification(localNotif: LocalNotification) {
    debugger;
    this.aqIndexNotif.setPeriod(localNotif.period);
  }

  public getHumanReadablePeriod(minutes: number) {
    moment.locale(this.translate.currentLang);
    return moment.duration(minutes, 'minute').humanize();
  }

}
