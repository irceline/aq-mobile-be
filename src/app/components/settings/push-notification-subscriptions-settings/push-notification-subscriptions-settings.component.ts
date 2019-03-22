import { Component, Input } from '@angular/core';

import { PushNotificationTopic } from '../../../services/notification-presenter/notification-presenter.service';
import {
  PushNotificationsHandlerService,
} from '../../../services/push-notifications-handler/push-notifications-handler.service';

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
    private notificationHandler: PushNotificationsHandlerService
  ) {
    this.flanders = this.notificationHandler.isTopicActive(PushNotificationTopic.flanders);
    this.wallonia = this.notificationHandler.isTopicActive(PushNotificationTopic.wallonia);
    this.brussels = this.notificationHandler.isTopicActive(PushNotificationTopic.brussels);
  }

  public toggleFlandersNotification() {
    if (this.flanders) {
      this.notificationHandler.subscribeTopic(PushNotificationTopic.flanders);
    } else {
      this.notificationHandler.unsubscribeTopic(PushNotificationTopic.flanders);
    }
  }

  public toggleWalloniaNotification() {
    if (this.wallonia) {
      this.notificationHandler.subscribeTopic(PushNotificationTopic.wallonia);
    } else {
      this.notificationHandler.unsubscribeTopic(PushNotificationTopic.wallonia);
    }
  }

  public toggleBrusselsNotification() {
    if (this.brussels) {
      this.notificationHandler.subscribeTopic(PushNotificationTopic.brussels);
    } else {
      this.notificationHandler.unsubscribeTopic(PushNotificationTopic.brussels);
    }
  }

}
