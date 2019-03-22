import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export enum PushNotificationTopic {
  flanders = 'flanders',
  wallonia = 'wallonia',
  brussels = 'brussels'
}

export interface PushNotification {
  topic: string;
  title: string;
  body: string;
  expiration: Date;
}

export interface LocatedValueNotification {
  latitude: number;
  longitude: number;
  date: Date;
  value: number;
}

export interface PersonalAlert {
  locationLabel: string;
  belaqi: number;
  sensitive: boolean;
}

@Injectable()
export class NotificationPresenterService {

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) { }

  public async presentPushNotification(notification: PushNotification) {
    // this.modalCtrl.create({
    //   component: PushNotificationComponent,
    //   componentProps: {
    //     notification
    //   }
    // }).then(modal => modal.present());

    const alert = await this.alertCtrl.create({
      header: notification.title,
      subHeader: this.getSubHeader(notification.topic),
      message: notification.body,
      buttons: ['OK']
    });
    await alert.present();
  }

  private getSubHeader(topic: string): string {
    if (topic) {
      if (topic.startsWith(PushNotificationTopic.brussels.toString())) {
        return this.translate.instant('push-notification-subscription.brussels');
      }
      if (topic.startsWith(PushNotificationTopic.flanders.toString())) {
        return this.translate.instant('push-notification-subscription.flanders');
      }
      if (topic.startsWith(PushNotificationTopic.wallonia.toString())) {
        return this.translate.instant('push-notification-subscription.wallonia');
      }
    }
  }

}
