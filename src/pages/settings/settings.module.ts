import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CommonSettingsComponent } from './common-settings/common-settings';
import { LocalNotificationSettingsComponent } from './local-notification-settings/local-notification-settings';
import { PushNotificationSettingsComponent } from './push-notification-settings/push-notification-settings';
import { SettingsPage } from './settings';
import { UserLocationsSettingsComponent } from './user-locations-settings/user-locations-settings';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LocalNotificationSettingsComponent,
    PushNotificationSettingsComponent,
    UserLocationsSettingsComponent,
    CommonSettingsComponent,
    SettingsPage
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    TranslateModule
  ]
})
export class SettingsModule { }
