import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { PushNotification } from './../../services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-notification-popover',
  templateUrl: './notification-popover.component.html',
  styleUrls: ['./notification-popover.component.scss'],
})
export class NotificationPopoverComponent implements OnInit {

  public notification: PushNotification;

  constructor(
    public navParams: NavParams,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.notification = this.navParams.data as PushNotification;
  }

}
