import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { NotificationMaintainerProvider } from '../../providers/notification-maintainer/notification-maintainer';
import { NotificationIconPopupComponent } from './notification-icon-popup';

@Component({
  selector: 'notification-icon',
  templateUrl: 'notification-icon.html'
})
export class NotificationIconComponent {

  public notificationCount: number;

  constructor(
    private popoverCtrl: PopoverController,
    private notifications: NotificationMaintainerProvider
  ) {
    this.notifications.getNotifications().subscribe(e => this.notificationCount = e.length);
  }

  public openPopup(ev) {
    this.popoverCtrl.create(NotificationIconPopupComponent, {}, { cssClass: 'notification-popover' }).present({ ev });
  }

}
