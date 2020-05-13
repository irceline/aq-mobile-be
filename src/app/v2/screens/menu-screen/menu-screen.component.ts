import { Component, OnInit } from '@angular/core';
import {NotificationType, UserNotificationSetting} from '../../components/user-notification-settings/user-notification-settings.component';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-menu-screen',
  templateUrl: './menu-screen.component.html',
  styleUrls: ['./menu-screen.component.scss'],
})
export class MenuScreenComponent implements OnInit {

  // get this from language settings
  language = 'e';

  userSettings: UserNotificationSetting[] = [
    {
      notificationType: NotificationType.highConcentration,
      enabled: true,
    },
    {
      notificationType: NotificationType.transport,
      enabled: true,
    },
    {
      notificationType: NotificationType.activity,
      enabled: false,
    },
    {
      notificationType: NotificationType.allergies,
      enabled: true,
    },
    {
      notificationType: NotificationType.exercise,
      enabled: false,
    },
  ];

  locationList: any[] = [
    { name: 'Koksijde', id: 'abc', order: 1 },
    { name: 'Herent', id: 'def', order: 2 },
  ];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}


  updateLocation(event) {
    console.log(event);
  }

  removeLocation(event) {
    console.log(event);
  }

  openAppInfo() {
    this.navCtrl.navigateForward(['main/app-info']);
  }

  openLongTermInfo() {
    this.navCtrl.navigateForward(['main/longterm-info']);
  }

}
