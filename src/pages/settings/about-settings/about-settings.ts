import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { NavController, Platform } from 'ionic-angular';

import { IntroPage } from '../../intro/intro';

@Component({
  selector: 'about-settings',
  templateUrl: 'about-settings.html'
})
export class AboutSettingsComponent {

  public version: string;

  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private nav: NavController
  ) {
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then(res => this.version = res);
    }
  }
  public openIntroduction() {
    this.nav.push(IntroPage);
  }
}
