import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavParams, ViewController } from 'ionic-angular';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { PersonalAlert } from '../../providers/notification-presenter/notification-presenter';

@Component({
  selector: 'located-value-notification',
  templateUrl: 'located-value-notification.html'
})
export class LocatedValueNotificationComponent {

  public alerts: PersonalAlert[]

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private translate: TranslateService,
    private belaqi: BelaqiIndexProvider
  ) {
    this.alerts = this.params.get('alerts');
  }

  public getHint(alert: PersonalAlert): string {
    switch (alert.belaqi) {
      case 1: return alert.sensitive ? this.translate.instant('personal-alert.index-1.sensitive') : this.translate.instant('personal-alert.index-1.non-sensitive');
      case 2: return alert.sensitive ? this.translate.instant('personal-alert.index-2.sensitive') : this.translate.instant('personal-alert.index-2.non-sensitive');
      case 3: return alert.sensitive ? this.translate.instant('personal-alert.index-3.sensitive') : this.translate.instant('personal-alert.index-3.non-sensitive');
      case 4: return alert.sensitive ? this.translate.instant('personal-alert.index-4.sensitive') : this.translate.instant('personal-alert.index-4.non-sensitive');
      case 5: return alert.sensitive ? this.translate.instant('personal-alert.index-5.sensitive') : this.translate.instant('personal-alert.index-5.non-sensitive');
      case 6: return alert.sensitive ? this.translate.instant('personal-alert.index-6.sensitive') : this.translate.instant('personal-alert.index-6.non-sensitive');
      case 7: return alert.sensitive ? this.translate.instant('personal-alert.index-7.sensitive') : this.translate.instant('personal-alert.index-7.non-sensitive');
      case 8: return alert.sensitive ? this.translate.instant('personal-alert.index-8.sensitive') : this.translate.instant('personal-alert.index-8.non-sensitive');
      case 9: return alert.sensitive ? this.translate.instant('personal-alert.index-9.sensitive') : this.translate.instant('personal-alert.index-9.non-sensitive');
      case 10: return alert.sensitive ? this.translate.instant('personal-alert.index-10.sensitive') : this.translate.instant('personal-alert.index-10.non-sensitive');
      default: return 'no match';
    }
  }

  public createColor(alert: PersonalAlert): string {
    return this.convertHex(this.belaqi.getColorForIndex(alert.belaqi), 20);
  }

  public getLabel(index: number) {
    return this.belaqi.getLabelForIndex(index);
  }

  private convertHex(hex: string, opacity: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
