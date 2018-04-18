import { Component } from '@angular/core';
import { Language, LocalStorage, SettingsService } from '@helgoland/core';

import { PushNotificationsProvider, PushNotificationTopic } from '../../providers/push-notifications/push-notifications';
import { MobileSettings } from '../../providers/settings/settings';

const USER_SETTINGS_PUSH_NOTIFICATION_NORMAL = 'user.settings.push.notification.normal';
const USER_SETTINGS_PUSH_NOTIFICATION_SENSITIVE = 'user.settings.push.notification.sensitive'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public normalPushNotification: boolean;
  public sensitivePushNotification: boolean;
  public languageList: Language[];

  constructor(
    private notifier: PushNotificationsProvider,
    private localStorage: LocalStorage,
    private settings: SettingsService<MobileSettings>
  ) {
    this.normalPushNotification = this.localStorage.load<boolean>(USER_SETTINGS_PUSH_NOTIFICATION_NORMAL) || false;
    this.sensitivePushNotification = this.localStorage.load<boolean>(USER_SETTINGS_PUSH_NOTIFICATION_SENSITIVE) || false;
    this.languageList = this.settings.getSettings().languages;
  }

  public updateNormalNotifications() {
    this.localStorage.save(USER_SETTINGS_PUSH_NOTIFICATION_NORMAL, this.normalPushNotification);
    if (this.normalPushNotification) {
      this.notifier.subscribeTopic(PushNotificationTopic.normal);
    } else {
      this.notifier.unsubscribeTopic(PushNotificationTopic.normal);
    }
  }

  public updateSensitiveNotifications() {
    this.localStorage.save(USER_SETTINGS_PUSH_NOTIFICATION_SENSITIVE, this.sensitivePushNotification);
    if (this.sensitivePushNotification) {
      this.notifier.subscribeTopic(PushNotificationTopic.sensitive);
    } else {
      this.notifier.unsubscribeTopic(PushNotificationTopic.sensitive);
    }
  }

}
