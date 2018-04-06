import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { PushNotification } from '../../providers/push-notifications/push-notifications';

@Component({
  selector: 'notification',
  templateUrl: 'notification.html'
})
export class NotificationComponent {

  public notification: PushNotification;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.notification = this.params.get('notification');
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
