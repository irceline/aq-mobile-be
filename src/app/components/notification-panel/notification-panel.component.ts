import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { NotificationMaintainerService } from '../../services/notification-maintainer/notification-maintainer.service';
import { PushNotification } from '../../services/push-notifications/push-notifications.service';
import { NotificationPopupComponent } from './notification-popup.component';

@Component({
  selector: 'notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent implements OnInit {

  public notificationMap: Map<string, PushNotification[]> = new Map();

  constructor(
    private modalCtrl: ModalController,
    private notifications: NotificationMaintainerService,
    private zone: NgZone
  ) { }

  public ngOnInit() {
    this.notifications.getNotifications().subscribe(e => {
      this.zone.run(() => this.notificationMap = e);
    });
  }

  public openPopup() {
    this.modalCtrl.create({
      component: NotificationPopupComponent
    }).then(popover => popover.present());
  }

}
