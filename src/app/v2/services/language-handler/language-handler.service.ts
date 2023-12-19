import { LOCATION_INITIALIZED, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import { Injectable, Injector } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer } from 'rxjs';
import { StorageService } from '../storage.service';

const LANGUAGE_STORAGE_KEY = 'LANGUAGE_STORAGE_KEY';

@Injectable()
export class LanguageHandlerService {

  constructor(
    private translate: TranslateService,
    private storage: StorageService
  ) {
    this.translate.onLangChange.subscribe(async(language) => {
      await this.storage.set(LANGUAGE_STORAGE_KEY, language.lang);
    });

    registerLocaleData(localeDe);
    registerLocaleData(localeEn);
    registerLocaleData(localeFr);
    registerLocaleData(localeNl);
  }

  public getSavedLanguage(): Promise<string> {
    return this.storage.get(LANGUAGE_STORAGE_KEY);
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
  storage: StorageService,
  translate: TranslateService,
  injector: Injector,
  handler: LanguageHandlerService,
  settingsSrvc: SettingsService<Settings>
) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

    storage.initialize().then(() => {

      locationInitialized.then(() => {
        handler.getSavedLanguage().then(
          lang => {
            console.log('savedLang', lang)
            if (lang) {
              translate.use(lang);
            } else {
              const langCode = navigator.language.split('-')[0];
              const language = settingsSrvc.getSettings().languages?.find(e => e.code === langCode);
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

    })
  });
}
