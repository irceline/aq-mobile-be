import { Component, Input, OnInit } from '@angular/core';
import { ToastController, PickerController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import {
  UserLocationNotificationsService,
  UserLocationSubscriptionError,
} from '../../services/user-location-notifications/user-location-notifications.service';
import { Subscription } from 'rxjs';
import { PickerOptions } from '@ionic/core';

@Component({
  selector: 'user-location-notifications-toggler',
  templateUrl: './user-location-notifications-toggler.component.html',
  styleUrls: ['./user-location-notifications-toggler.component.scss'],
})
export class UserLocationNotificationsTogglerComponent implements OnInit {

  @Input()
  public location: UserLocation;

  public subscribed: boolean;
  public loading: boolean;

  private notificationSubscription: Subscription;

  constructor(
    private locationNotifications: UserLocationNotificationsService,
    private toast: ToastController,
    private translate: TranslateService,
    private indexPicker: PickerController
  ) { }

  public ngOnInit() {
    this.notificationSubscription = this.locationNotifications.isRegisteredSubscription(this.location)
      .subscribe(v => { this.subscribed = v; });
  }

  public unregisterSubscription() {
    this.notificationSubscription.unsubscribe();
  }

  public handleToggleChange(evt) {
    if (evt.target.checked !== this.subscribed) {
      // Don't toggle now, let it happen by toggleSubscription
      evt.target.checked = this.subscribed;
    }
  }

  public toggleSubscription() {
    this.loading = true;
    if (!this.subscribed) {
      let opts: PickerOptions = {
        mode: "md",
        buttons: [
          {
            text: this.translate.instant("controls.cancel"),
            role: 'cancel',
          },
          {
            text: "Done",
            handler: (value: any): void => {
              let index = value["index"]["value"];
              if (index > 0) {
                this.locationNotifications.subscribeLocation(this.location, index)
                  .subscribe(
                    res => {
                      this.subscribed = res;
                      this.loading = false;
                    },
                    error => {
                      this.presentError(error);
                      this.loading = false;
                    }
                  );
              }
            },
          },
        ],
        columns: [
          {
            name: "index",
            prefix: this.translate.instant("customize-personal-alerts.alert-index-level"),
            options: [
              { text: '1', value: 1 },
              { text: '2', value: 2 },
              { text: '3', value: 3 },
              { text: '4', value: 4 },
              { text: '5', value: 5 },
              { text: '6', value: 6 },
              { text: '7', value: 7 },
              { text: '8', value: 8 },
              { text: '9', value: 9 },
              { text: '10', value: 10 },
            ]
          }
        ]
      }
      this.indexPicker.create(opts).then(p => {
        p.present();
      }).catch(error => {
        this.presentError(error);
        this.loading = false;
      })
    } else {
      this.locationNotifications.unsubscribeLocation(this.location)
        .subscribe(
          res => {
            this.subscribed = !res;
            this.loading = false;
          },
          error => {
            this.presentError(error);
            this.loading = false;
          }
        );
    }
  }

  private presentError(error: UserLocationSubscriptionError): void {
    let message;
    switch (error) {
      case UserLocationSubscriptionError.BackendRegistration:
        message = this.translate.instant('user-location-notification-toggler.backend-registration-error');
        break;
      case UserLocationSubscriptionError.NotificationSubscription:
        message = this.translate.instant('user-location-notification-toggler.notification-error');
        break;
      default:
        message = this.translate.instant('user-location-notification-toggler.default-error');
        break;
    }
    this.toast.create({ message, duration: 3000 }).then(toast => toast.present());
  }

}
