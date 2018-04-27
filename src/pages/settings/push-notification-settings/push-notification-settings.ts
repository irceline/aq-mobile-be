import { Component } from '@angular/core';

import { PushNotificationTopic } from '../../../providers/notification-presenter/notification-presenter';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';

@Component({
  selector: 'push-notification-settings',
  templateUrl: 'push-notification-settings.html'
})
export class PushNotificationSettingsComponent {

  public normalPushNotification: boolean;
  public sensitivePushNotification: boolean;

  constructor(
    private notifier: PushNotificationsProvider
  ) {
    this.normalPushNotification = this.notifier.isTopicActive(PushNotificationTopic.normal);
    this.sensitivePushNotification = this.notifier.isTopicActive(PushNotificationTopic.sensitive);
  }

  public updateNormalNotifications() {
    if (this.normalPushNotification) {
      this.notifier.subscribeTopic(PushNotificationTopic.normal);
    } else {
      this.notifier.unsubscribeTopic(PushNotificationTopic.normal);
    }
  }

  public updateSensitiveNotifications() {
    if (this.sensitivePushNotification) {
      this.notifier.subscribeTopic(PushNotificationTopic.sensitive);
    } else {
      this.notifier.unsubscribeTopic(PushNotificationTopic.sensitive);
    }
  }

}
