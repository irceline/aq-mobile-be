import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';

import { NotificationMaintainerService } from '../notification-maintainer/notification-maintainer.service';
import {
  NotificationPresenterService,
  PushNotification,
  PushNotificationTopic,
} from '../notification-presenter/notification-presenter.service';

@Injectable()
export class PushNotificationsService {

  constructor(
    private platform: Platform,
    private fcm: FCM,
    private notifications: NotificationMaintainerService,
    private presenter: NotificationPresenterService
  ) { }

  public init() {
    console.log(`PushNotificationsService - init`);
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.fcm.getToken().then(token => {
          // Your best bet is to here store the token on the user's profile on the
          // Firebase database, so that when you want to send notifications to this
          // specific user you can do it from Cloud Functions.
          this.doSomethingWithToken(token);
        });

        this.fcm.onTokenRefresh().subscribe(token => this.doSomethingWithToken(token));

        this.fcm.onNotification().subscribe(data => {
          console.log(`onNotification: ${data.wasTapped}`);
          if (data.wasTapped) {
            // Notification was received on device tray and tapped by the user.
          } else {
            // Notification was received in foreground. Maybe the user needs to be notified.
          }
          if (data.title && data.body && data.expiration && data.topic) {
            const notification: PushNotification = {
              title: data.title,
              body: data.body,
              topic: data.topic,
              expiration: new Date(data.expiration)
            };
            console.log(`add Notification: ${data.title}, ${data.body}, ${data.expiration}, ${data.topic}`);
            this.notifications.addNotification(notification);
            this.presenter.presentPushNotification(notification);
          }
        });

      }
    });
  }

  public subscribeTopic(topic: string) {
    if (this.platform.is('cordova')) {
      console.log(`subscribe topic: ${topic}`);
      this.fcm.subscribeToTopic(topic);
    }
  }

  public unsubscribeTopic(topic: string) {
    if (this.platform.is('cordova')) {
      console.log(`unsubscribe topic: ${topic}`);
      this.fcm.unsubscribeFromTopic(topic);
    }
  }

  private doSomethingWithToken(token: string) { }

}
