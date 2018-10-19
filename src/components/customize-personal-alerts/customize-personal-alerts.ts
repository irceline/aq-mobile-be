import { Component, Input } from '@angular/core';
import { LanguageChangNotifier, SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { PersonalAlertsProvider } from '../../providers/personal-alerts/personal-alerts';
import { MobileSettings, PersonalAlert } from '../../providers/settings/settings';

interface LevelOption {
  label: string;
  color: string;
}

@Component({
  selector: 'customize-personal-alerts',
  templateUrl: 'customize-personal-alerts.html'
})
export class CustomizePersonalAlertsComponent extends LanguageChangNotifier {

  @Input()
  public showHeader = true;

  public personalAlertsActive: boolean;
  public personalAlertSettings: PersonalAlert[];
  public currentPeriod: number;
  public personalAlertLevel: LevelOption[] = [];
  public currentLevel: number;
  public sensitive: boolean;

  constructor(
    private personalAlertsProvider: PersonalAlertsProvider,
    private settings: SettingsService<MobileSettings>,
    protected translate: TranslateService,
    private belaqi: BelaqiIndexProvider
  ) {
    super(translate);
    this.personalAlertsActive = this.personalAlertsProvider.isActive();
    this.currentPeriod = this.personalAlertsProvider.getPeriod();
    this.currentLevel = this.personalAlertsProvider.getLevel();
    this.sensitive = this.personalAlertsProvider.getSensitive();
    this.personalAlertSettings = this.settings.getSettings().personalAlert;
    this.setLevelOptions();
  }

  protected languageChanged(): void {
    this.setLevelOptions();
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

  private setLevelOptions() {
    for (let i = 0; i < 10; i++) {
      this.personalAlertLevel[i] = {
        label: `${i + 1} - ${this.belaqi.getLabelForIndex(i + 1)}`,
        color: this.belaqi.getColorForIndex(i + 1)
      }
    }
  }

}
