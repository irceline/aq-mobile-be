import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { NotificationMaintainerService } from '../../services/notification-maintainer/notification-maintainer.service';
import { PushNotification } from '../../services/push-notifications/push-notifications.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import {
  UserLocationTopicGeneratorService,
} from '../../services/user-location-notifications/user-location-topic-generator.service';
import { NotificationPopupComponent } from './notification-popup.component';
import { UserLocationNotificationsService } from 'src/app/services/user-location-notifications/user-location-notifications.service';

@Component({
  selector: 'notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent implements OnInit {

  @Input()
  public location: UserLocation;

  public notificationMap: Map<string, PushNotification[]> = new Map();

  constructor(
    private modalCtrl: ModalController,
    private notifications: NotificationMaintainerService,
    private userLocationTopicGenerator: UserLocationTopicGeneratorService,
    private userLocationNotificationService: UserLocationNotificationsService,
    private zone: NgZone
  ) { }

  public ngOnInit() {
    this.notifications.getNotifications().subscribe(e => {
      e.forEach((v, k) => console.log(k));
      this.zone.run(() => this.filterNotifications(e));
    });
  }

  private filterNotifications(list: Map<string, PushNotification[]>) {
    const filtered = new Map();
    list.forEach((val, key) => {
      if (val.length > 0) {
        const topic = val[0].topic;
        // Check if the notification is location-specific and applies to this panel.
        if (this.userLocationTopicGenerator.isUserLocationTopic(topic)) {
          this.userLocationNotificationService.getSubscriptionFromTopic(topic).subscribe(
            sub => {
              if (this.location.latitude === sub.lat && this.location.longitude === sub.lng) {
                filtered.set(key, val);
              }
            }
          )
        } else {
          filtered.set(key, val);
        }
      }
    });
    return this.notificationMap = filtered;
  }

  public openPopup() {
    this.modalCtrl.create({
      component: NotificationPopupComponent,
      componentProps: {
        notificationMap: this.notificationMap
      }
    }).then(popover => popover.present());
  }

}
