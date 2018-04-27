import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';

import {
  NotificationPresenter,
  PushNotification,
  PushNotificationTopic,
} from '../notification-presenter/notification-presenter';

const LOCALSTORAGE_PUSH_NOTIFICATION = 'localstorage.push.notification';

@Injectable()
export class PushNotificationsProvider {

  constructor(
    private platform: Platform,
    private fcm: FCM,
    private localStorage: LocalStorage,
    private presenter: NotificationPresenter
  ) { }

  public init() {
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
          if (data.wasTapped) {
            //Notification was received on device tray and tapped by the user.
          } else {
            //Notification was received in foreground. Maybe the user needs to be notified.
          }
          this.presenter.presentPushNotification(data as PushNotification);
        });
      }
    });
  }

  public isTopicActive(topic: PushNotificationTopic): boolean {
    return this.localStorage.load<boolean>(LOCALSTORAGE_PUSH_NOTIFICATION + topic) || false;
  }

  public subscribeTopic(topic: PushNotificationTopic) {
    this.localStorage.save(LOCALSTORAGE_PUSH_NOTIFICATION + topic, true);
    if (this.platform.is('cordova')) {
      this.fcm.subscribeToTopic(topic.toString());
    }
  }

  public unsubscribeTopic(topic: PushNotificationTopic) {
    this.localStorage.save(LOCALSTORAGE_PUSH_NOTIFICATION + topic, false);
    if (this.platform.is('cordova')) {
      this.fcm.unsubscribeFromTopic(topic.toString());
    }
  }

  private doSomethingWithToken(token: string) { }

}
