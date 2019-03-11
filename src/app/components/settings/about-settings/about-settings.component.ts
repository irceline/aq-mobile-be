import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ModalController, Platform } from '@ionic/angular';

import { ModalIntroComponent } from '../modal-intro/modal-intro.component';

@Component({
  selector: 'about-settings',
  templateUrl: './about-settings.component.html',
  styleUrls: ['./about-settings.component.scss'],
})
export class AboutSettingsComponent {

  public version: string;

  constructor(
    private appVersion: AppVersion,
    private modalCtrl: ModalController,
    private platform: Platform,
  ) {
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then(res => this.version = res);
    }
  }
  public openIntroduction() {
    this.modalCtrl.create({ component: ModalIntroComponent }).then(modal => modal.present());
  }

}
