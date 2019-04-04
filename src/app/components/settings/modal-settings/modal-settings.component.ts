import { Component, OnInit } from '@angular/core';
import { Language, SettingsService } from '@helgoland/core';
import { ModalController } from '@ionic/angular';

import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { MobileSettings } from '../../../services/settings/settings.service';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.scss'],
})
export class ModalSettingsComponent implements OnInit {

  public languageList: Language[];

  constructor(
    private settings: SettingsService<MobileSettings>,
    private modalCtrl: ModalController,
    private analytics: AnalyticsService
  ) {
    this.languageList = this.settings.getSettings().languages;
  }

  public ngOnInit(): void {
    this.analytics.logEvent('open_modal_settings', { testProp: 'testValue' });
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }

}
