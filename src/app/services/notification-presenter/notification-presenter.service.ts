import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PushNotificationComponent } from '../../components/push-notification/push-notification.component';

export enum PushNotificationTopic {
  flanders = 'flanders',
  wallonia = 'wallonia',
  brussels = 'brussels'
}

export interface PushNotification {
  topic: PushNotificationTopic;
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
    private modalCtrl: ModalController
  ) { }

  public presentPushNotification(notification: PushNotification) {
    this.modalCtrl.create({
      component: PushNotificationComponent,
      componentProps: {
        notification
      }
    }).then(modal => modal.present());
  }

  // public presentPersonalAlerts(alerts: PersonalAlert[]) {
  //   if (alerts.length !== 0) {
  //     this.modalCtrl.create(LocatedValueNotificationComponent, { alerts }).present();
  //   }
  // }

}
