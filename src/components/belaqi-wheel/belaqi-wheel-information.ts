import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'belaqi-wheel-information',
  templateUrl: 'belaqi-wheel-information.html'
})
export class BelaqiWheelInformationComponent {

  constructor(
    private iab: InAppBrowser,
    private translate: TranslateService
  ) { }

  public showMoreInfo() {
    this.iab.create(this.translate.instant('info.wheel.link'));
  }

}
