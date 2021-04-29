import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { from, Observable, of, ReplaySubject } from 'rxjs';

export interface PushNotification {
  topic: string;
  title: string;
  body: string;
  expiration: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  public notificationReceived: ReplaySubject<PushNotification> = new ReplaySubject(1);

  constructor(
    private platform: Platform,
    private firebase: FirebaseX
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('ios')) {
          this.firebase.grantPermission();
        }
        this.firebase.getToken().then(token => console.log(`Got token ${token}`));
        this.firebase.onTokenRefresh().subscribe(token => console.log(`Refresh token ${token}`));

        this.firebase.onMessageReceived().subscribe(data => {
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
            console.log(`New notification arrived (${data.topic}, ${data.title}, ${data.expiration})`);
            this.notificationReceived.next(notification);
          }
        });
      }
    });
  }

  public subscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('cordova') || this.platform.is('ios') || this.platform.is('android')) {
      console.log(`subscribe topic: ${topic}`);
      return from(this.firebase.subscribe(topic));
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

  public unsubscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('cordova') || this.platform.is('ios') || this.platform.is('android')) {
      console.log(`unsubscribe topic: ${topic}`);
      return from(this.firebase.unsubscribe(topic));
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

}
