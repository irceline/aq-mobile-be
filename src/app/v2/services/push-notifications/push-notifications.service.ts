import { Injectable, NgZone } from '@angular/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { App } from '@capacitor/app';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, of, ReplaySubject } from 'rxjs';

export interface PushNotification {
  topic: string;
  title: string;
  body: string;
  expiration: Date;
  location_name?: string;
  channel_id?: string;
  unique_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  public notificationReceived: ReplaySubject<PushNotification> = new ReplaySubject(1);

  public fcmToken!: string;
  public appVersion!: string;

  constructor(
    private platform: Platform,
    private nav: NavController,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private translate: TranslateService,
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('capacitor')) {

        App.getInfo()
          .then((info) => {
            this.appVersion = info.version;
          })

        // NOT USED ANYMORE ?
        // if (this.platform.is('ios')) {
        //   this.firebase.grantPermission();
        // }

        FirebaseMessaging.getToken().then((token) => {
          console.log('FCM Token', token.token);
          this.fcmToken = token.token
        });
        FirebaseMessaging.addListener('tokenReceived', (event) => {
          console.log('FCM new tokenReceived', event.token);
          this.fcmToken = event.token
        })

        // OLD CODE
        // this.firebase.onMessageReceived().subscribe(data => {
        //   if (data.title && data.body && data.expiration && data.topic) {
        //     const notification: PushNotification = {
        //       title: data.title,
        //       body: data.body,
        //       topic: data.topic,
        //       expiration: new Date(data.expiration),
        //       location_name: data?.location_name ?? '',
        //       unique_id: data?.unique_id ?? '',
        //       channel_id: data?.channel_id ?? ''
        //     };
        //     console.log(`New notification arrived (${data.topic}, ${data.title}, ${data.expiration})`);
        //     this.notificationReceived.next(notification);

        //     if (data.wasTapped) {
        //       // Notification was received on device tray and tapped by the user.
        //     }
        //     else if (data.tap === 'background') {
        //       // Notification tapped on background
        //       this.onNotifTapped(notification)
        //     }
        //     else {
        //       // Notification was received in foreground. Maybe the user needs to be notified.
        //     }
        //   }
        // });

        // New Code
        FirebaseMessaging.addListener('notificationReceived', (event) => {
          console.log('notificationReceived', JSON.stringify(event.notification))
          const data = event.notification;
          const extraData:any = data.data;
          // since on latest android update foreground notif its not working, need to add local notif plugins
          if (data.title && data.body && extraData.expiration && extraData.topic) {
            const notification: PushNotification = {
              title: data.title,
              body: data.body,
              topic: extraData.topic,
              expiration: new Date(extraData.expiration),
              location_name: extraData?.location_name ?? '',
              unique_id: extraData?.unique_id ?? '',
              channel_id: extraData?.channel_id ?? ''
            };
            console.log(`New notification arrived (${extraData.topic}, ${data.title}, ${extraData.expiration})`);
            this.notificationReceived.next(notification);

            this.onNotifTapped(notification)
          }
        });

        // This handler on FCM background
        FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
          console.log('notificationActionPerformed', JSON.stringify(event))

          const data = event.notification;
          const extraData: any = data.data;
          // since on latest android update foreground notif its not working, need to add local notif plugins
          if (extraData.title && extraData.body && extraData.expiration && extraData.topic) {
            const notification: PushNotification = {
              title: extraData.title,
              body: extraData.body,
              topic: extraData.topic,
              expiration: new Date(extraData.expiration),
              location_name: extraData?.location_name ?? '',
              unique_id: extraData?.unique_id ?? '',
              channel_id: extraData?.channel_id ?? ''
            };
            console.log(`New notification arrived from background(${extraData.topic}, ${data.title}, ${extraData.expiration})`);
            this.notificationReceived.next(notification);

            this.onNotifTapped(notification)
          } else {
            console.log('Notification handler failed, probably because title or body not exist on data');
          }
        })
      }
    });
  }

  public subscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android')) {

      FirebaseMessaging.checkPermissions().then((permission) => {
        console.log('FCM permission', permission.receive)
        if (permission.receive !== 'granted') {
          FirebaseMessaging.requestPermissions()
            .then((d) => {
              console.log('FCM request permission', d.receive)
              if(d.receive == 'denied') {
                console.log(`FCM request permission ${d.receive}`)
                console.log(`Opening app setting ...`);
                NativeSettings.open({
                  optionAndroid: AndroidSettings.AppNotification,
                  optionIOS: IOSSettings.App // for iOS only supportApp
                })
              }
            })
            .catch(error => console.error('FCM request permission ERR!', JSON.stringify(error)));
        }

        FirebaseMessaging.subscribeToTopic({ topic: topic })
          .then(() => {
            console.log(`subscribing to topic: ${topic} gave status: OK`);
          })
          .catch(error => console.error('subscribeTopic ERR!', JSON.stringify(error)));
      });

      return of(true);
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

  public unsubscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android')) {
      FirebaseMessaging.unsubscribeFromTopic({ topic: topic })
        .then(() => {
          console.log(`unsubscribeFromTopic to topic: ${topic} gave status: OK`);
        })
        .catch(error => console.error('unsubscribeFromTopic ERR!', JSON.stringify(error)));
      return of(true);
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

  onNotifTapped(notification: PushNotification) {
    // general notif show simple alert
    console.log('onNotifTapped')
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
