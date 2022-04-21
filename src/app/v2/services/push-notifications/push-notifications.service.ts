import { Injectable, NgZone } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, of, ReplaySubject } from 'rxjs';

declare var cordova: any;

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
  public fcmToken: string;
  public appVersion: string;

  constructor(
    private platform: Platform,
    private firebase: FirebaseX,
    private nav: NavController,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private translate: TranslateService,
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        cordova.getAppVersion.getVersionCode().then((version) => {
          this.appVersion = version
        });

        if (this.platform.is('ios')) {
          this.firebase.grantPermission();
        }

        this.firebase.getToken().then(token => this.fcmToken = token);
        this.firebase.onTokenRefresh().subscribe(token => this.fcmToken = token);

        this.firebase.onMessageReceived().subscribe(data => {
          if (data.title && data.body && data.expiration && data.topic) {
            const notification: PushNotification = {
              title: data.title,
              body: data.body,
              topic: data.topic,
              expiration: new Date(data.expiration)
            };
            console.log(`New notification arrived (${data.topic}, ${data.title}, ${data.expiration})`);
            this.notificationReceived.next(notification);
            
            if (data.wasTapped) {
              // Notification was received on device tray and tapped by the user.
            }
            else if (data.tap === 'background') {
              // Notification tapped on background
              this.onNotifTapped(notification)
            }
            else {
              // Notification was received in foreground. Maybe the user needs to be notified.
            }
          }
        });
      }
    });
  }

  public subscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('cordova') || this.platform.is('ios') || this.platform.is('android')) {
      this.firebase.subscribe(topic).then((response) => {
        console.log(`subscribing to topic: ${topic} gave status: ${response}`);
      })
      return of(true);
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

  public unsubscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('cordova') || this.platform.is('ios') || this.platform.is('android')) {
      this.firebase.unsubscribe(topic).then((response) => {
        console.log(`unsubscribe from topic: ${topic} gave status: ${response}`);
      });
      return of(true);
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

  onNotifTapped(notification: PushNotification) {
    // general notif show simple alert
    if (notification.topic.startsWith('belair_')) return this.zone.run(
      async () => {
        const alert = await this.alertCtrl.create({
          header: notification.title,
          message: notification.body,
          buttons: [{
            text: this.translate.instant('controls.ok'),
            handler: () => {
              alert.dismiss()
            },
          }],
        });
        await alert.present();
      })
    // loc notif
    return this.zone.run(() => this.nav.navigateBack('main', { queryParams: { popNotif: true } }))
  }
}
