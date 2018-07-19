import { Component, Input } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { PersonalAlertsProvider } from '../../providers/personal-alerts/personal-alerts';
import { MobileSettings, PersonalAlert } from '../../providers/settings/settings';

@Component({
  selector: 'customize-personal-alerts',
  templateUrl: 'customize-personal-alerts.html'
})
export class CustomizePersonalAlertsComponent {

  @Input()
  public showHeader = true;

  public personalAlertsActive: boolean;
  public personalAlertSettings: PersonalAlert[];
  public currentPeriod: number;
  public personalAlertLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public currentLevel: number;
  public sensitive: boolean;

  constructor(
    private personalAlertsProvider: PersonalAlertsProvider,
    private settings: SettingsService<MobileSettings>,
    private translate: TranslateService
  ) {
    this.personalAlertsActive = this.personalAlertsProvider.isActive();
    this.currentPeriod = this.personalAlertsProvider.getPeriod();
    this.currentLevel = this.personalAlertsProvider.getLevel();
    this.sensitive = this.personalAlertsProvider.getSensitive();
    this.personalAlertSettings = this.settings.getSettings().personalAlert;
  }

  public togglePersonalAlerts() {
    if (this.personalAlertsActive) {
      this.personalAlertsProvider.activate();
    } else {
      this.personalAlertsProvider.deactivate();
    }
  }

  public toggleSensitive() {
    this.personalAlertsProvider.setSensitive(this.sensitive);
  }

  public setPersonalAlertPeriod(period: number) {
    this.personalAlertsProvider.setPeriod(period);
  }

  public setPersonalAlertLevel(level: number) {
    this.personalAlertsProvider.setLevel(level);
  }

  public getHumanReadablePeriod(minutes: number) {
    moment.locale(this.translate.currentLang);
    return moment.duration(minutes, 'minute').humanize();
  }

}
