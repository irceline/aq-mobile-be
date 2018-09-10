import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from 'ionic-angular';

import { IntroPage } from '../pages/intro/intro';
import { StartPage } from '../pages/start/start';
import { IrcelineSettings, IrcelineSettingsProvider } from '../providers/irceline-settings/irceline-settings';
import { LanguageHandlerProvider } from '../providers/language-handler/language-handler';
import { PersonalAlertsProvider } from '../providers/personal-alerts/personal-alerts';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: NavController;

  public rootPage: any;

  public lastupdate: Date;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private languageHandler: LanguageHandlerProvider,
    private ircelineSettings: IrcelineSettingsProvider,
    private pushNotification: PushNotificationsProvider,
    private localNotification: PersonalAlertsProvider,
    private storage: Storage
  ) {
    this.languageHandler.init();
    this.initializeApp();

    this.ircelineSettings.getSettings(false).subscribe((settings: IrcelineSettings) => this.lastupdate = settings.lastupdate);

    this.pushNotification.init();
    this.localNotification.init();
    this.decideStartView();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.show();
      this.splashScreen.hide();
    });
  }

  private decideStartView() {
    const firstStartKey = 'firstTimeStarted';
    this.rootPage = StartPage;

    this.storage.get(firstStartKey).then(value => {
      if (value === null) {
        this.nav.push(IntroPage);
        this.storage.set(firstStartKey, true);
      }
    })
  }

}
