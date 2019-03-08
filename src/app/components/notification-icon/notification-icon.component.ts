import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { NotificationMaintainerService } from '../../services/notification-maintainer/notification-maintainer.service';
import { NotificationIconPopupComponent } from './notification-icon-popup.component';

@Component({
  selector: 'notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss'],
})
export class NotificationIconComponent {

  public notificationCount: number;

  constructor(
    private popoverCtrl: PopoverController,
    private notifications: NotificationMaintainerService
  ) {
    this.notifications.getNotifications().subscribe(e => this.notificationCount = e.length);
  }

  public openPopup(ev) {
    this.popoverCtrl.create({
      component: NotificationIconPopupComponent,
      event: ev
    }).then(popover => popover.present());
  }

}
