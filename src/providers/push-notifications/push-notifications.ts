import { Injectable } from '@angular/core';
import { FCM, NotificationData } from '@ionic-native/fcm';
import { ModalController, Platform } from 'ionic-angular';

import { NotificationComponent } from '../../components/notification/notification';

export enum PushNotificationTopic {
  sensitive = 'sensitive',
  normal = 'normal'
}

export interface PushNotification extends NotificationData {
  topic: PushNotificationTopic;
  title: string;
  body: string;
}

@Injectable()
export class PushNotificationsProvider {

  constructor(
    private platform: Platform,
    private fcm: FCM,
    private modalCtrl: ModalController
  ) {
    this.activate();
  }

  public subscribeTopic(topic: PushNotificationTopic) {
    if (this.platform.is('cordova')) {
      this.fcm.subscribeToTopic(topic.toString());
    }
  }

  public unsubscribeTopic(topic: PushNotificationTopic) {
    if (this.platform.is('cordova')) {
      this.fcm.unsubscribeFromTopic(topic.toString());
    }
  }

  private activate() {
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
          this.presentNotification(data as PushNotification);
        });
      }
    });
  }

  public presentNotification(notification: PushNotification) {
    this.modalCtrl.create(NotificationComponent, { notification }).present();
  }

  private doSomethingWithToken(token: string) { }

}
