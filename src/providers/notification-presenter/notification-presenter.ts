import { Injectable } from '@angular/core';
import { NotificationData } from '@ionic-native/fcm';
import { ModalController } from 'ionic-angular';

import { LocatedValueNotificationComponent } from '../../components/located-value-notification/located-value-notification';
import { PushNotificationComponent } from '../../components/push-notification/push-notification';


export enum PushNotificationTopic {
  flanders = 'flanders',
  wallonia = 'wallonia',
  brussels = 'brussels'
}

export interface PushNotification extends NotificationData {
  topic: PushNotificationTopic;
  title: string;
  body: string;
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
export class NotificationPresenter {

  constructor(
    private modalCtrl: ModalController
  ) { }

  public presentPushNotification(notification: PushNotification) {
    this.modalCtrl.create(PushNotificationComponent, { notification }).present();
  }

  public presentPersonalAlerts(alerts: PersonalAlert[]) {
    if (alerts.length !== 0) {
      this.modalCtrl.create(LocatedValueNotificationComponent, { alerts }).present();
    }
  }

}
