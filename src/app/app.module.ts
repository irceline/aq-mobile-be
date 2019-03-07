import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SettingsService } from '@helgoland/core';
import { GeoSearch } from '@helgoland/map';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CacheModule } from 'ionic-cache';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeoLabelsService } from './services/geo-labels/geo-labels.service';
import { GeoSearchService } from './services/geo-search/geo-search.service';
import { LanguageHandlerService, languageInitializerFactory } from './services/language-handler/language-handler.service';
import { LocateService } from './services/locate/locate.service';
import { JSSONSettingsService } from './services/settings/settings.service';
import { UserLocationListService } from './services/user-location-list/user-location-list.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    CacheModule.forRoot({ keyPrefix: 'belair-cache_' })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SettingsService, useClass: JSSONSettingsService },
    { provide: GeoSearch, useClass: GeoSearchService },
    {
      provide: APP_INITIALIZER,
      useFactory: languageInitializerFactory,
      deps: [TranslateService, Injector, LanguageHandlerService, SettingsService],
      multi: true
    },
    LocateService,
    SplashScreen,
    StatusBar,
    GeoLabelsService,
    UserLocationListService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
