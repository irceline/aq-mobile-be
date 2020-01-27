import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { NotificationMaintainerService } from '../../services/notification-maintainer/notification-maintainer.service';
import { PushNotification } from '../../services/push-notifications/push-notifications.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import {
  UserLocationTopicGeneratorService,
} from '../../services/user-location-notifications/user-location-topic-generator.service';
import { NotificationPopupComponent } from './notification-popup.component';

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
    private zone: NgZone
  ) { }

  public ngOnInit() {
    this.notifications.getNotifications().subscribe(e => {
      e.forEach((v, k) => console.log(v));
      this.zone.run(() => this.filterNotifications(e));
    });
  }

  private filterNotifications(list: Map<string, PushNotification[]>) {
    const filtered = new Map();
    list.forEach((val, key) => {
      if (val && val.length > 0) {
        const topic = val[0].topic;
        if (this.userLocationTopicGenerator.isUserLocationTopic(topic)) {
          const topicLoc = this.userLocationTopicGenerator.generateLatLngOfTopic(topic);
          if (this.location.latitude === topicLoc.lat && this.location.longitude === topicLoc.lng) {
            filtered.set(key, val);
          }
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
