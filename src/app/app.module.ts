import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HelgolandCachingModule } from '@helgoland/caching';
import { DatasetApiInterface, SettingsService, SplittedDataDatasetApiInterface } from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import {
  GeoSearch,
  HelgolandMapControlModule,
  HelgolandMapSelectorModule,
  HelgolandMapViewModule,
  NominatimGeoSearchService,
} from '@helgoland/map';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Diagnostic } from '@ionic-native/diagnostic';
import { FCM } from '@ionic-native/fcm';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';
import { CombinedMapPage } from '../pages/combined-map/combined-map';
import { DiagramPage } from '../pages/diagram/diagram';
import { IntroPage } from '../pages/intro/intro';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsModule } from '../pages/settings/settings.module';
import { StartPage } from '../pages/start/start';
import { AirQualityIndexProvider } from '../providers/air-quality-index/air-quality-index';
import { BelaqiIndexProvider } from '../providers/belaqi/belaqi';
import { CategorizeValueToIndexProvider } from '../providers/categorize-value-to-index/categorize-value-to-index';
import { ForecastValueProvider } from '../providers/forecast-value/forecast-value';
import { IrcelineSettingsProvider } from '../providers/irceline-settings/irceline-settings';
import { LanguageHandlerProvider } from '../providers/language-handler/language-handler';
import { LayerGeneratorService } from '../providers/layer-generator/layer-generator';
import { LocateProvider } from '../providers/locate/locate';
import { ModelledValueProvider } from '../providers/modelled-value/modelled-value';
import { NotificationPresenter } from '../providers/notification-presenter/notification-presenter';
import { PersonalAlertsProvider } from '../providers/personal-alerts/personal-alerts';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';
import { RefreshHandler } from '../providers/refresh/refresh';
import { JSSONSettingsService } from '../providers/settings/settings';
import { TimeseriesService } from '../providers/timeseries/timeseries.service';
import { UserLocationListProvider } from '../providers/user-location-list/user-location-list';
import { MyApp } from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DiagramPage,
    CombinedMapPage,
    IntroPage,
    MyApp,
    StartPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    HelgolandDatasetlistModule,
    HelgolandCachingModule,
    HelgolandMapViewModule,
    HelgolandD3Module,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      scrollAssist: false
    }),
    IonicStorageModule.forRoot(),
    ComponentsModule,
    SettingsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiagramPage,
    CombinedMapPage,
    IntroPage,
    MyApp,
    SettingsPage,
    StartPage
  ],
  providers: [
    { provide: DatasetApiInterface, useClass: SplittedDataDatasetApiInterface },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: GeoSearch, useClass: NominatimGeoSearchService },
    { provide: SettingsService, useClass: JSSONSettingsService },
    AirQualityIndexProvider,
    BackgroundGeolocation,
    BackgroundMode,
    BelaqiIndexProvider,
    CategorizeValueToIndexProvider,
    Diagnostic,
    FCM,
    ForecastValueProvider,
    Geolocation,
    IrcelineSettingsProvider,
    LanguageHandlerProvider,
    LayerGeneratorService,
    LocalNotifications,
    LocateProvider,
    ModelledValueProvider,
    Network,
    NotificationPresenter,
    PersonalAlertsProvider,
    PushNotificationsProvider,
    RefreshHandler,
    SplashScreen,
    StatusBar,
    TimeseriesService,
    UserLocationListProvider,
  ]
})
export class AppModule { }
