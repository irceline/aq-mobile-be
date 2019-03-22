import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PushNotification } from '../../services/notification-presenter/notification-presenter.service';

@Component({
  selector: 'push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss'],
})
export class PushNotificationComponent {

  public notification: PushNotification;

  constructor(
    private modalCtrl: ModalController
  ) { }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
