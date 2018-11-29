import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { D3TimeFormatLocaleService } from '@helgoland/d3';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer } from 'rxjs';

const LANGUAGE_STORAGE_KEY = 'LANGUAGE_STORAGE_KEY';

@Injectable()
export class LanguageHandlerProvider {

  constructor(
    private settingsSrvc: SettingsService<Settings>,
    private translate: TranslateService,
    private d3translate: D3TimeFormatLocaleService,
    private storage: Storage
  ) { }

  public init() {
    this.storage.get(LANGUAGE_STORAGE_KEY).then(value => {
      if (value) {
        this.translate.use(value);
      } else {
        const langCode = navigator.language.split('-')[0];
        const language = this.settingsSrvc.getSettings().languages.find(lang => lang.code === langCode);
        this.translate.use(language ? language.code : 'en');
      }
    })

    this.translate.onLangChange.subscribe(language => {
      this.storage.set(LANGUAGE_STORAGE_KEY, language.lang);
    });

    this.addD3TimeFormatLocales();

    registerLocaleData(localeDe);
    registerLocaleData(localeEn);
    registerLocaleData(localeFr);
    registerLocaleData(localeNl);
  }

  private addD3TimeFormatLocales() {
    this.d3translate.addTimeFormatLocale('de', {
      'dateTime': '%a %b %e %X %Y',
      'date': '%d-%m-%Y',
      'time': '%H:%M:%S',
      'periods': ['AM', 'PM'],
      'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      'months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    });
    this.d3translate.addTimeFormatLocale('fr', {
      'dateTime': '%A, le %e %B %Y, %X',
      'date': '%d/%m/%Y',
      'time': '%H:%M:%S',
      'periods': ['AM', 'PM'],
      'days': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      'shortDays': ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
      'months': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      'shortMonths': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
    });
    this.d3translate.addTimeFormatLocale('nl', {
      'dateTime': '%a %e %B %Y %T',
      'date': '%d-%m-%Y',
      'time': '%H:%M:%S',
      'periods': ['AM', 'PM'],
      'days': ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
      'shortDays': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
      'months': ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
      'shortMonths': ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    });
  }


  public waitForTranslation(): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      if (this.translate.currentLang) {
        observer.next(true);
        observer.complete();
      } else {
        const langChanged = this.translate.onLangChange.subscribe(() => {
          observer.next(true);
          observer.complete();
          langChanged.unsubscribe();
        })
      }
    });
  }
}
