import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import { Component, ViewChild } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { D3TimeFormatLocaleService } from '@helgoland/d3';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { NavController, Platform } from 'ionic-angular';

import { CombinedMapPage } from '../pages/combined-map/combined-map';
import { DiagramPage } from '../pages/diagram/diagram';
import { IntroPage } from '../pages/intro/intro';
import { SettingsPage } from '../pages/settings/settings';
import { StartPage } from '../pages/start/start';
import { IrcelineSettings, IrcelineSettingsProvider } from '../providers/irceline-settings/irceline-settings';
import { PersonalAlertsProvider } from '../providers/personal-alerts/personal-alerts';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: NavController;

  public rootPage: any;

  public pages: Array<{ title: string, component: any }>;

  public lastupdate: Date;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private settingsSrvc: SettingsService<Settings>,
    private translate: TranslateService,
    private ircelineSettings: IrcelineSettingsProvider,
    private pushNotification: PushNotificationsProvider,
    private localNotification: PersonalAlertsProvider,
    private d3translate: D3TimeFormatLocaleService,
    private storage: Storage
  ) {
    this.initializeApp();

    this.ircelineSettings.getSettings(false).subscribe((settings: IrcelineSettings) => this.lastupdate = settings.lastupdate);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'map.header', component: CombinedMapPage },
      { title: 'diagram.header', component: DiagramPage },
      { title: 'settings.header', component: SettingsPage },
    ];

    this.pushNotification.init();
    this.localNotification.init();
    this.decideStartView();
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (this.nav.getActive().name != page.component.name) {
      this.nav.push(page.component);
    }
  }

  private initializeApp() {
    const langCode = navigator.language.split('-')[0];
    const language = this.settingsSrvc.getSettings().languages.find(lang => lang.code === langCode);
    if (language) {
      this.translate.use(language.code)
    } else {
      this.translate.use('en');
    }

    this.d3translate.addTimeFormatLocale('de',
      {
        'dateTime': '%a %b %e %X %Y',
        'date': '%d-%m-%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      }
    );

    this.d3translate.addTimeFormatLocale('fr',
      {
        'dateTime': '%A, le %e %B %Y, %X',
        'date': '%d/%m/%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        'shortDays': ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
        'months': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        'shortMonths': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
      }
    )

    this.d3translate.addTimeFormatLocale('nl',
      {
        'dateTime': '%a %e %B %Y %T',
        'date': '%d-%m-%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        'shortDays': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        'months': ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        'shortMonths': ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
      }
    )

    registerLocaleData(localeDe);
    registerLocaleData(localeEn);
    registerLocaleData(localeFr);
    registerLocaleData(localeNl);

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
    this.storage.get(firstStartKey).then(value => {
      if (value !== null) {
        this.rootPage = StartPage;
      } else {
        this.storage.set(firstStartKey, true);
        this.rootPage = IntroPage;
      }
    })
  }

}
