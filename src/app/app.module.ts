import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DatasetApiInterface, HelgolandCoreModule, SettingsService } from '@helgoland/core';
import { GeoSearch } from '@helgoland/map';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { EncryptionService } from './services/encryption/encryption.service';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CacheModule } from 'ionic-cache';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AnnualMeanService } from './services/annual-mean/annual-mean.service';
import { BelaqiIndexService } from './services/belaqi/belaqi.service';
import { CategorizedValueService } from './services/categorized-value/categorized-value.service';
import {
  CustomDatasetApiInterfaceService,
} from './services/custom-dataset-api-interface/custom-dataset-api-interface.service';
import { DailyMeanValueService } from './services/daily-mean-value/daily-mean-value.service';
import { GeoLabelsService } from './services/geo-labels/geo-labels.service';
import { GeoSearchService } from './services/geo-search/geo-search.service';
import { IrcelineSettingsService } from './services/irceline-settings/irceline-settings.service';
import { LanguageHandlerService, languageInitializerFactory } from './services/language-handler/language-handler.service';
import { LocateService } from './services/locate/locate.service';
import { MapDataService } from './services/map-data/map-data.service';
import { ModelledValueService } from './services/modelled-value/modelled-value.service';
import { NearestTimeseriesManagerService } from './services/nearest-timeseries-manager/nearest-timeseries-manager.service';
import { NearestTimeseriesService } from './services/nearest-timeseries/nearest-timeseries.service';
import { NetworkAlertService } from './services/network-alert/network-alert.service';
import { NotificationMaintainerService } from './services/notification-maintainer/notification-maintainer.service';
import { CachingInterceptor, OngoingHttpCacheService } from './services/ongoing-http-cache/ongoing-http-cache.service';
import { PushNotificationsHandlerService } from './services/push-notifications-handler/push-notifications-handler.service';
import { PushNotificationsService } from './services/push-notifications/push-notifications.service';
import { RefreshHandler } from './services/refresh/refresh.service';
import { JSSONSettingsService } from './services/settings/settings.service';
import { StartPageSettingsService } from './services/start-page-settings/start-page-settings.service';
import { UserLocationListService } from './services/user-location-list/user-location-list.service';
import { InfoOverlayService } from './services/overlay-info-drawer/overlay-info-drawer.service';

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
    AutoCompleteModule,
    HelgolandCoreModule,
    ComponentsModule,
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
    { provide: DatasetApiInterface, useClass: CustomDatasetApiInterfaceService },
    { provide: GeoSearch, useClass: GeoSearchService },
    {
      provide: APP_INITIALIZER,
      useFactory: languageInitializerFactory,
      deps: [TranslateService, Injector, LanguageHandlerService, SettingsService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    },
    AnnualMeanService,
    AppVersion,
    BelaqiIndexService,
    CategorizedValueService,
    DailyMeanValueService,
    Diagnostic,
    EncryptionService,
    Firebase,
    GeoLabelsService,
    Geolocation,
    InAppBrowser,
    InfoOverlayService,
    IrcelineSettingsService,
    Keyboard,
    LanguageHandlerService,
    LocateService,
    LocationAccuracy,
    MapDataService,
    ModelledValueService,
    NearestTimeseriesManagerService,
    NearestTimeseriesService,
    Network,
    NetworkAlertService,
    NotificationMaintainerService,
    OngoingHttpCacheService,
    PushNotificationsHandlerService,
    PushNotificationsService,
    RefreshHandler,
    SplashScreen,
    StartPageSettingsService,
    StatusBar,
    UserLocationListService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
