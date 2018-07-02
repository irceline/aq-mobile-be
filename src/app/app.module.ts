import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HelgolandCachingModule } from '@helgoland/caching';
import { DatasetApiInterface, SettingsService, SplittedDataDatasetApiInterface } from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandFlotModule } from '@helgoland/flot';
import {
  GeoSearch,
  HelgolandMapControlModule,
  HelgolandMapSelectorModule,
  HelgolandMapViewModule,
  NominatimGeoSearchService,
} from '@helgoland/map';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FCM } from '@ionic-native/fcm';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';
import { DiagramPage } from '../pages/diagram/diagram';
import { ForecastPage } from '../pages/forecast/forecast';
import { MapPage } from '../pages/map/map';
import {
  LocalNotificationSettingsComponent,
} from '../pages/settings/local-notification-settings/local-notification-settings';
import { PushNotificationSettingsComponent } from '../pages/settings/push-notification-settings/push-notification-settings';
import { SettingsPage } from '../pages/settings/settings';
import { StartPage } from '../pages/start/start';
import { AirQualityIndexProvider } from '../providers/air-quality-index/air-quality-index';
import { BelaqiIndexProvider } from '../providers/belaqi/belaqi';
import { ForecastValueProvider } from '../providers/forecast-value/forecast-value';
import { IrcelineSettingsProvider } from '../providers/irceline-settings/irceline-settings';
import { LayerGeneratorService } from '../providers/layer-generator/layer-generator';
import { LocalNotificationsProvider } from '../providers/local-notification/local-notification';
import { LocateProvider } from '../providers/locate/locate';
import { ModelledValueProvider } from '../providers/modelled-value/modelled-value';
import { NotificationPresenter } from '../providers/notification-presenter/notification-presenter';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';
import { RefreshHandler } from '../providers/refresh/refresh';
import { JSSONSettingsService } from '../providers/settings/settings';
import { TimeseriesService } from '../providers/timeseries/timeseries.service';
import { MyApp } from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    MapPage,
    DiagramPage,
    SettingsPage,
    ForecastPage,
    LocalNotificationSettingsComponent,
    PushNotificationSettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    HelgolandFlotModule,
    HelgolandDatasetlistModule,
    HelgolandCachingModule,
    HelgolandMapViewModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    MapPage,
    DiagramPage,
    SettingsPage,
    ForecastPage
  ],
  providers: [
    { provide: DatasetApiInterface, useClass: SplittedDataDatasetApiInterface },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: GeoSearch, useClass: NominatimGeoSearchService },
    { provide: SettingsService, useClass: JSSONSettingsService },
    AirQualityIndexProvider,
    BackgroundGeolocation,
    BackgroundMode,
    FCM,
    ForecastValueProvider,
    Geolocation,
    IrcelineSettingsProvider,
    LayerGeneratorService,
    LocalNotifications,
    LocalNotificationsProvider,
    ModelledValueProvider,
    Network,
    NotificationPresenter,
    PushNotificationsProvider,
    RefreshHandler,
    SplashScreen,
    StatusBar,
    TimeseriesService,
    LocateProvider,
    BelaqiIndexProvider,
  ]
})
export class AppModule { }
