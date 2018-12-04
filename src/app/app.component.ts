import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from 'ionic-angular';

import { DiagramPage } from '../pages/diagram/diagram';
import { IntroPage } from '../pages/intro/intro';
import { MapPage } from '../pages/map/map';
import { SettingsPage } from '../pages/settings/settings';
import { StartPage } from '../pages/start/start';
import { IrcelineSettings, IrcelineSettingsProvider } from '../providers/irceline-settings/irceline-settings';
import { LanguageHandlerProvider } from '../providers/language-handler/language-handler';
import { PersonalAlertsProvider } from '../providers/personal-alerts/personal-alerts';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements AfterViewInit {

  @ViewChild('content') nav: NavController;

  public rootPage: any;

  public selectedPage: string;

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

  public ngAfterViewInit(): void {
    this.registerNavigationChanges();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(true);
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

  // navigation

  private registerNavigationChanges() {
    this.nav.viewDidEnter.subscribe((view) => {
      if (this.nav.length() > 2) {
        this.nav.remove(1, 1);
      }
      switch (view.instance.name) {
        case 'start':
          this.selectedPage = 'start';
          break;
        case 'map':
          this.selectedPage = 'map';
          break;
        case 'diagram':
          this.selectedPage = 'diagram';
          break;
        case 'settings':
          this.selectedPage = 'settings';
          break;
      }
    });
  }

  public openPage(page: string) {
    if (this.nav.getActive().instance.name != page) {
      if (page !== 'start') {
        this.nav.push(this.getMatchingPage(page));
      } else {
        this.selectedPage = 'start';
        this.nav.pop();
      }
    }
  }

  private getMatchingPage(page: string) {
    switch (page) {
      case 'start':
        return StartPage;
      case 'map':
        return MapPage;
      case 'diagram':
        return DiagramPage;
      case 'settings':
        return SettingsPage;
    }
  }

}
