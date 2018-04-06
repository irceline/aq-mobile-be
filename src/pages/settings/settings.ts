import { Component } from '@angular/core';
import { LocalStorage } from '@helgoland/core';

import { PushNotificationsProvider, PushNotificationTopic } from '../../providers/push-notifications/push-notifications';

const USER_SETTINGS_PUSH_NOTIFICATION_NORMAL = 'user.settings.push.notification.normal';
const USER_SETTINGS_PUSH_NOTIFICATION_SENSITIVE = 'user.settings.push.notification.sensitive'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public normalPushNotification: boolean;
  public sensitivePushNotification: boolean;

  constructor(
    private notifier: PushNotificationsProvider,
    private localStorage: LocalStorage
  ) {
    this.normalPushNotification = this.localStorage.load<boolean>(USER_SETTINGS_PUSH_NOTIFICATION_NORMAL) || false;
    this.sensitivePushNotification = this.localStorage.load<boolean>(USER_SETTINGS_PUSH_NOTIFICATION_SENSITIVE) || false;
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
