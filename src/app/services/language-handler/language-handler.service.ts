import { LOCATION_INITIALIZED, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import { Injectable, Injector } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { D3TimeFormatLocaleService } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer } from 'rxjs';
import { Storage } from '@ionic/storage';

const LANGUAGE_STORAGE_KEY = 'LANGUAGE_STORAGE_KEY';

@Injectable({
  providedIn: 'root'
})
export class LanguageHandlerService {

  constructor(
    private translate: TranslateService,
    private d3translate: D3TimeFormatLocaleService,
    private storage: Storage
  ) {
    this.translate.onLangChange.subscribe(language => {
      this.storage.set(LANGUAGE_STORAGE_KEY, language.lang);
    });

    this.addD3TimeFormatLocales();

    registerLocaleData(localeDe);
    registerLocaleData(localeEn);
    registerLocaleData(localeFr);
    registerLocaleData(localeNl);
  }

  public getSavedLanguage(): Promise<string> {
    return this.storage.get(LANGUAGE_STORAGE_KEY);
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
      'months': [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
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
        });
      }
    });
  }
}

export function languageInitializerFactory(
  translate: TranslateService,
  injector: Injector,
  handler: LanguageHandlerService,
  settingsSrvc: SettingsService<Settings>
) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      handler.getSavedLanguage().then(
        lang => {
          if (lang) {
            translate.use(lang);
          } else {
            const langCode = navigator.language.split('-')[0];
            const language = settingsSrvc.getSettings().languages.find(e => e.code === langCode);
            translate.use(language ? language.code : 'en');
          }
          resolve(null);
        },
        () => {
          // set language to english
          translate.use('en');
          resolve(null);
        });
    });
  });
}
