import { Component } from '@angular/core';
import { Language, SettingsService } from '@helgoland/core';

import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public name = 'settings';
  public languageList: Language[];

  constructor(
    private settings: SettingsService<MobileSettings>
  ) {
    this.languageList = this.settings.getSettings().languages;
  }

}
