import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PushNotification } from '../../services/push-notifications/push-notifications.service';

@Component({
  selector: 'notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
})
export class NotificationPopupComponent {

  @Input()
  public notificationMap: Map<string, PushNotification[]>;

  constructor(
    private modalCtrl: ModalController
  ) { }

  public trimTopic(topic: string): string {
    return topic.indexOf('_') === -1 ? topic : topic.substring(0, topic.indexOf('_'));
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }

}
