import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { PushNotification } from '../../providers/notification-presenter/notification-presenter';

@Component({
  selector: 'push-notification',
  templateUrl: 'push-notification.html'
})
export class PushNotificationComponent {

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
