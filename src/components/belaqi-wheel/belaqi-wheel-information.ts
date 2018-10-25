import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'belaqi-wheel-information',
  templateUrl: 'belaqi-wheel-information.html'
})
export class BelaqiWheelInformationComponent {

  constructor(
    private iab: InAppBrowser,
    private settings: SettingsService<MobileSettings>
  ) { }

  public showMoreInfo() {
    this.iab.create(this.settings.getSettings().belaqiInformationUrl);
  }

}
