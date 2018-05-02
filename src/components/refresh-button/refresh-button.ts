import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';

import { RefreshHandler } from '../../providers/refresh/refresh';

@Component({
  selector: 'refresh-button',
  templateUrl: 'refresh-button.html'
})
export class RefreshButtonComponent {

  constructor(
    private toast: ToastController,
    private platform: Platform,
    private refresher: RefreshHandler
  ) { }

  public refresh() {
    if (this.platform.is('cordova')) {
      this.toast.create({
        message: 'Refresh all'
      }).present();
    }
    this.refresher.refresh();
  }
}