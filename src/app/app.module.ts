import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HelgolandCoreModule, SettingsService } from '@helgoland/core';
import { CacheModule } from 'ionic-cache';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// services
import { LanguageHandlerService, languageInitializerFactory } from './v2/services/language-handler/language-handler.service';
import { StorageService } from './v2/services/storage.service';
import { JSSONSettingsService } from './v2/services/settings/settings.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    HelgolandCoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot(),
    CacheModule.forRoot({ keyPrefix: 'belair-cache_' }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SettingsService, useClass: JSSONSettingsService },
    {
      provide: APP_INITIALIZER,
      useFactory: languageInitializerFactory,
      deps: [
        StorageService,
        TranslateService,
        Injector,
        LanguageHandlerService,
        SettingsService,
      ],
      multi: true,
    },
    StorageService,
    LanguageHandlerService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
