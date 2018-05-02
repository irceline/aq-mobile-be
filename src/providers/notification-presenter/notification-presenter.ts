import { Injectable } from '@angular/core';
import { NotificationData } from '@ionic-native/fcm';
import { ModalController } from 'ionic-angular';

import { LocatedValueNotificationComponent } from '../../components/located-value-notification/located-value-notification';
import { PushNotificationComponent } from '../../components/push-notification/push-notification';


export enum PushNotificationTopic {
  sensitive = 'sensitive',
  normal = 'normal'
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

@Injectable()
export class NotificationPresenter {

  constructor(
    private modalCtrl: ModalController
  ) { }

  public presentPushNotification(notification: PushNotification) {
    this.modalCtrl.create(PushNotificationComponent, { notification }).present();
  }

  public presentLocatedValueNotification(notification: LocatedValueNotification) {
    this.modalCtrl.create(LocatedValueNotificationComponent, { notification }).present();
  }

}
