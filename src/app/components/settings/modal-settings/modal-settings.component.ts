import { Component } from '@angular/core';
import { Language, SettingsService } from '@helgoland/core';
import { ModalController } from '@ionic/angular';

import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { MobileSettings } from '../../../services/settings/settings.service';
import { UserLocationListService } from '../../../services/user-location-list/user-location-list.service';
import { PushNotificationsHandlerService } from '../../../services/push-notifications-handler/push-notifications-handler.service';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.scss'],
})
export class ModalSettingsComponent {

  public languageList: Language[];

  constructor(
    private settings: SettingsService<MobileSettings>,
    private modalCtrl: ModalController,
    private userLocations: UserLocationListService,
    private analytics: AnalyticsService,
    private notifcationHandler: PushNotificationsHandlerService
  ) {
    this.languageList = this.settings.getSettings().languages;
  }

  public closeModal() {
    this.modalCtrl.dismiss();
    const props = {
      userLocationsCount: this.userLocations.getLocationListLength(),
      usesCurrentLocation: this.userLocations.isCurrentLocationVisible(),
      usesNotifications: this.notifcationHandler.listOfNotifications().join(', ')
    };
    this.analytics.logEvent('uses_settings', props);
  }

}
