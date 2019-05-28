import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PushNotificationsHandlerService } from '../push-notifications-handler/push-notifications-handler.service';
import {
  PushNotification,
  PushNotificationsService,
  PushNotificationTopic,
} from '../push-notifications/push-notifications.service';
import { USER_LOCATION_NOTIFICATION_TOPIC_PREFIX } from '../user-location-notifications/user-location-topic-generator.service';

const NOTIFICATION_PARAM = 'notifications';

@Injectable()
export class NotificationMaintainerService {

  private notificationsReplay: ReplaySubject<Map<string, PushNotification[]>> = new ReplaySubject(1);
  private notifications: Map<string, PushNotification[]> = new Map();

  constructor(
    private storage: Storage,
    private pushNotificationHandler: PushNotificationsHandlerService,
    private pushNotificationService: PushNotificationsService
  ) {
    this.storage.get(NOTIFICATION_PARAM)
      .then(res => res ? this.setNotifications(this.deserializeNotifications(res)) : this.setNotifications(new Map()))
      .catch(() => this.setNotifications(new Map()));
    setInterval(() => this.saveNotifications(), 10000);

    this.pushNotificationService.notificationReceived.subscribe(notification => {
      this.addNotification(notification);
    });
  }

  private setNotifications(res: Map<string, PushNotification[]>) {
    this.notifications = res;
    this.saveNotifications();
  }

  public getNotifications(): Observable<Map<string, PushNotification[]>> {
    return this.notificationsReplay.asObservable();
  }

  public hasNotifications(): Observable<boolean> {
    return this.notificationsReplay.asObservable().pipe(map(e => e.size > 0));
  }

  public addNotification(notification: PushNotification) {
    const key = this.generateKey(notification);
    if (this.notifications.has(key)) {
      const walloniaActive = this.pushNotificationHandler.isTopicActive(PushNotificationTopic.wallonia);
      const flandersActive = this.pushNotificationHandler.isTopicActive(PushNotificationTopic.flanders);
      const isFr = notification.topic.indexOf('fr') > -1;
      const isNl = notification.topic.indexOf('nl') > -1;
      if ((walloniaActive && !flandersActive && isFr) || (flandersActive && !walloniaActive && isNl)) {
        this.notifications.get(key).unshift(notification);
      } else {
        this.notifications.get(key).push(notification);
      }
    } else {
      this.notifications.set(key, [notification]);
    }
    this.saveNotifications();
  }

  private saveNotifications() {
    this.filterNotifications();
    this.storage.set(NOTIFICATION_PARAM, this.serializeNotifications(this.notifications));
    this.notificationsReplay.next(this.notifications);
  }

  private serializeNotifications(notifications: Map<string, PushNotification[]>): any {
    const serialized = {};
    notifications.forEach((val, key) => serialized[key] = val);
    return serialized;
  }

  private deserializeNotifications(res: any): Map<string, PushNotification[]> {
    const deserialized = new Map();
    for (const key in res) {
      if (res.hasOwnProperty(key)) {
        const elem = res[key];
        if (elem.length > 0) {
          elem.forEach(e => e.expiration = new Date(e.expiration));
          deserialized.set(key, elem);
        }
      }
    }
    return deserialized;
  }

  private generateKey(notification: PushNotification): string {
    let topic = notification.topic;
    if (!notification.topic.startsWith(USER_LOCATION_NOTIFICATION_TOPIC_PREFIX)) {
      const idx = notification.topic.indexOf('_') === -1 ? notification.topic.length : notification.topic.indexOf('_');
      topic = notification.topic.substring(0, idx);
    }
    return `${notification.expiration.getTime()}@${topic}`;
  }

  private filterNotifications() {
    this.notifications.forEach((val, key) => {
      if (val.length) {
        if (val[0].expiration.getTime() < new Date().getTime()) {
          this.notifications.delete(key);
        }
      } else {
        this.notifications.delete(key);
      }
    });
  }
}
