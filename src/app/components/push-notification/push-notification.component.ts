import { Component, OnInit } from '@angular/core';
import { PushNotification } from '../../services/notification-presenter/notification-presenter.service';

@Component({
  selector: 'push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss'],
})
export class PushNotificationComponent {

  public notification: PushNotification;

  constructor(
    // private viewCtrl: ViewController,
    // private params: NavParams
  ) {
    // this.notification = this.params.get('notification');
  }

  public dismiss() {
    // this.viewCtrl.dismiss();
  }
}
