import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform, ToastController } from 'ionic-angular';

import { RefreshHandler } from '../../providers/refresh/refresh';

@Component({
  selector: 'refresh-button',
  templateUrl: 'refresh-button.html'
})
export class RefreshButtonComponent {

  constructor(
    private toast: ToastController,
    private translate: TranslateService,
    private platform: Platform,
    private refresher: RefreshHandler
  ) { }

  public refresh() {
    if (this.platform.is('cordova')) {
      this.toast.create({
        message: this.translate.instant('refresh-button.message'),
        duration: 3000
      }).present();
    }
    this.refresher.refresh();
  }
}
