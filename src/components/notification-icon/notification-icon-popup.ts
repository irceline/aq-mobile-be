import { Component } from '@angular/core';

import { NotificationMaintainerProvider } from '../../providers/notification-maintainer/notification-maintainer';
import { PushNotification } from '../../providers/notification-presenter/notification-presenter';

@Component({
  selector: 'notification-icon-popup',
  templateUrl: 'notification-icon-popup.html'
})
export class NotificationIconPopupComponent {

  public notifications: PushNotification[];

  constructor(
    private notificationMaintainer: NotificationMaintainerProvider
  ) {
    this.notificationMaintainer.getNotifications().subscribe(e => this.notifications = e);
  }

}
