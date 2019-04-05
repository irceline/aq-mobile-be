import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { PushNotificationTopic } from '../notification-presenter/notification-presenter.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

const LOCALSTORAGE_PUSH_NOTIFICATION = 'localstorage.push.notification';

@Injectable()
export class PushNotificationsHandlerService {

  constructor(
    private localStorage: LocalStorage,
    private translate: TranslateService,
    private notifier: PushNotificationsService
  ) {
    this.translate.onLangChange.subscribe(() => {
      if (this.isTopicActive(PushNotificationTopic.brussels)) {
        this.unsubscribeTopic(PushNotificationTopic.brussels);
        this.subscribeTopic(PushNotificationTopic.brussels);
      }
    });
  }

  public isTopicActive(topic: PushNotificationTopic | string): boolean {
    return this.localStorage.load<boolean>(LOCALSTORAGE_PUSH_NOTIFICATION + topic) || false;
  }

  public subscribeTopic(topic: PushNotificationTopic): any {
    this.localStorage.save(LOCALSTORAGE_PUSH_NOTIFICATION + topic, true);
    switch (topic) {
      case PushNotificationTopic.flanders:
      case PushNotificationTopic.wallonia:
        this.notifier.subscribeTopic(topic.toString());
        break;
      case PushNotificationTopic.brussels:
        switch (this.translate.currentLang) {
          case 'nl':
            this.notifier.subscribeTopic(`${topic.toString()}_nl`);
            break;
          case 'fr':
            this.notifier.subscribeTopic(`${topic.toString()}_fr`);
            break;
          case 'de':
          case 'en':
            this.notifier.subscribeTopic(`${topic.toString()}_nl`);
            this.notifier.subscribeTopic(`${topic.toString()}_fr`);
            break;
        }
        break;
    }
  }

  public unsubscribeTopic(topic: PushNotificationTopic): any {
    this.localStorage.save(LOCALSTORAGE_PUSH_NOTIFICATION + topic, false);
    switch (topic) {
      case PushNotificationTopic.flanders:
      case PushNotificationTopic.wallonia:
        this.notifier.unsubscribeTopic(topic.toString());
        break;
      case PushNotificationTopic.brussels:
        this.notifier.unsubscribeTopic(`${topic.toString()}_nl`);
        this.notifier.unsubscribeTopic(`${topic.toString()}_fr`);
        break;
    }
  }

  public listOfNotifications(): string[] {
    const notifications = [];
    for (const topic in PushNotificationTopic) {
      if (this.isTopicActive(topic)) {
        notifications.push(topic);
      }
    }
    return notifications;
  }

}
