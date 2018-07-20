import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { CommonSettingsComponent } from './common-settings/common-settings';
import { SettingsPage } from './settings';
import { UserLocationsSettingsComponent } from './user-locations-settings/user-locations-settings';

@NgModule({
  declarations: [
    CommonSettingsComponent,
    UserLocationsSettingsComponent,
    SettingsPage
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    ComponentsModule,
    TranslateModule
  ]
})
export class SettingsModule { }
