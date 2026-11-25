import { TranslateService } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { PushNotification } from './../../services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-notification-popover',
  templateUrl: './notification-popover.component.html',
  styleUrls: ['./notification-popover.component.scss'],
})
export class NotificationPopoverComponent implements OnInit, OnDestroy {

  // @ts-ignore
  public notifications: PushNotification[];

  private expirationTimer: any;

  constructor(
    public navParams: NavParams,
    public translate: TranslateService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    // @ts-ignore
    if (this.navParams?.data?.notifications) {
      // @ts-ignore
      this.notifications = this.navParams.data.notifications as PushNotification[];
    }
    // Auto-dismiss when the earliest expiration passes: the services clear
    // their own state at expiry, but nothing ever closed an already-presented
    // popover (NEB-777).
    this.scheduleAutoDismiss();
  }

  ngOnDestroy() {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
  }

  private scheduleAutoDismiss() {
    if (!this.notifications?.length) {
      return;
    }
    const earliest = Math.min(
      ...this.notifications.map(n => new Date(n.expiration).getTime())
    );
    const delay = earliest - Date.now();
    if (delay <= 0) {
      this.popoverController.dismiss();
      return;
    }
    this.expirationTimer = setTimeout(() => this.popoverController.dismiss(), delay);
  }

}
