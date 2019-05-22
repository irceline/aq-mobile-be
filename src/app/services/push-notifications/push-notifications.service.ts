import { EventEmitter, Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';

export interface PushNotification {
  topic: string;
  title: string;
  body: string;
  expiration: Date;
}

export enum PushNotificationTopic {
  flanders = 'flanders',
  wallonia = 'wallonia',
  brussels = 'brussels'
}

@Injectable()
export class PushNotificationsService {

  public notificationReceived: EventEmitter<PushNotification> = new EventEmitter();

  constructor(
    private platform: Platform,
    private firebase: Firebase,
  ) { }

  public init() {
    console.log(`PushNotificationsService - init`);
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.firebase.getToken().then(token => {
          // Your best bet is to here store the token on the user's profile on the
          // Firebase database, so that when you want to send notifications to this
          // specific user you can do it from Cloud Functions.
          this.doSomethingWithToken(token);
        });
        this.firebase.onTokenRefresh().subscribe(token => this.doSomethingWithToken(token));

        this.firebase.onNotificationOpen().subscribe(data => {
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
            console.log(`${JSON.stringify(data)}`);
            console.log(`add Notification: ${data.title}, ${data.body}, ${data.expiration}, ${data.topic}`);
            this.notificationReceived.emit(notification);
          }
        });
      }
    });
  }

  public subscribeTopic(topic: string): Promise<boolean> {
    if (this.platform.is('cordova')) {
      console.log(`subscribe topic: ${topic}`);
      return this.firebase.subscribe(topic);
    }
  }

  public unsubscribeTopic(topic: string): Promise<boolean> {
    if (this.platform.is('cordova')) {
      console.log(`unsubscribe topic: ${topic}`);
      return this.firebase.unsubscribe(topic);
    }
  }

  private doSomethingWithToken(token: string) { }

}
