import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { NotificationMaintainerService } from '../../services/notification-maintainer/notification-maintainer.service';
import { PushNotification } from '../../services/push-notifications/push-notifications.service';

@Component({
  selector: 'notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
})
export class NotificationPopupComponent {

  public notifications: PushNotification[];

  constructor(
    private notificationMaintainer: NotificationMaintainerService,
    private modalCtrl: ModalController
  ) {
    this.notificationMaintainer.getNotifications().subscribe(e => this.notifications = e);
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }

}
