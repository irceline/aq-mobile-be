import { Component } from '@angular/core';

import { NotificationMaintainerService } from '../../services/notification-maintainer/notification-maintainer.service';
import { PushNotification } from '../../services/notification-presenter/notification-presenter.service';

@Component({
  selector: 'app-notification-icon-popup',
  templateUrl: './notification-icon-popup.component.html',
  styleUrls: ['./notification-icon-popup.component.scss'],
})
export class NotificationIconPopupComponent {

  public notifications: PushNotification[];

  constructor(
    private notificationMaintainer: NotificationMaintainerService
  ) {
    this.notificationMaintainer.getNotifications().subscribe(e => this.notifications = e);
  }

}
