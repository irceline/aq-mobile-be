import { Component, Input } from '@angular/core';

import { PushNotificationTopic } from '../../../services/notification-presenter/notification-presenter.service';
import { PushNotificationsService } from '../../../services/push-notifications/push-notifications.service';

@Component({
  selector: 'push-notification-subscriptions-settings',
  templateUrl: './push-notification-subscriptions-settings.component.html',
  styleUrls: ['./push-notification-subscriptions-settings.component.scss'],
})
export class PushNotificationSubscriptionsSettingsComponent {

  @Input()
  public hideHeader: boolean;

  public flanders: boolean;
  public wallonia: boolean;
  public brussels: boolean;

  constructor(
    private notifier: PushNotificationsService
  ) {
    this.flanders = this.notifier.isTopicActive(PushNotificationTopic.flanders);
    this.wallonia = this.notifier.isTopicActive(PushNotificationTopic.wallonia);
    this.brussels = this.notifier.isTopicActive(PushNotificationTopic.brussels);
  }

  public toggleFlandersNotification() {
    if (this.flanders) {
      this.notifier.subscribeTopic(PushNotificationTopic.flanders);
    } else {
      this.notifier.unsubscribeTopic(PushNotificationTopic.flanders);
    }
  }

  public toggleWalloniaNotification() {
    if (this.wallonia) {
      this.notifier.subscribeTopic(PushNotificationTopic.wallonia);
    } else {
      this.notifier.unsubscribeTopic(PushNotificationTopic.wallonia);
    }
  }

  public toggleBrusselsNotification() {
    if (this.brussels) {
      this.notifier.subscribeTopic(PushNotificationTopic.brussels);
    } else {
      this.notifier.unsubscribeTopic(PushNotificationTopic.brussels);
    }
  }

}
