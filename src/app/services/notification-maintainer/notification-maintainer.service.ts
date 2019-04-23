import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PushNotification } from '../push-notifications/push-notifications.service';

const NOTIFICATION_PARAM = 'notifications';
@Injectable()
export class NotificationMaintainerService {

  private notificationsReplay: ReplaySubject<PushNotification[]> = new ReplaySubject(1);
  private notifications: PushNotification[] = [];

  constructor(
    private storage: Storage
  ) {
    this.storage.get(NOTIFICATION_PARAM)
      .then(res => res ? this.setNotifications(res) : this.setNotifications([]))
      .catch(() => this.setNotifications([]));
    // check and filter expired notifications
    setInterval(() => this.saveNotifications(), 60000);
  }

  private setNotifications(res: PushNotification[]) {
    this.notifications = res;
    this.saveNotifications();
  }

  public getNotifications(): Observable<PushNotification[]> {
    this.saveNotifications();
    return this.notificationsReplay.asObservable();
  }

  public hasNotifications(): Observable<boolean> {
    return this.notificationsReplay.asObservable().pipe(map(e => e.length > 0));
  }

  public addNotification(notification: PushNotification) {
    this.notifications.push(notification);
    this.saveNotifications();
  }

  private saveNotifications() {
    this.notifications = this.notifications.filter(e => e.expiration.getTime() > new Date().getTime());
    this.storage.set(NOTIFICATION_PARAM, this.notifications);
    this.notificationsReplay.next(this.notifications);
  }

}
