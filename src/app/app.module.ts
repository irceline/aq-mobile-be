import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HelgolandCachingModule } from '@helgoland/caching';
import { DatasetApiInterface, SettingsService, SplittedDataDatasetApiInterface } from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction/datasetlist';
import { HelgolandFlotModule } from '@helgoland/flot';
import { GeoSearch, NominatimGeoSearchService } from '@helgoland/map';
import { HelgolandMapControlModule } from '@helgoland/map/control';
import { HelgolandMapSelectorModule } from '@helgoland/map/selector';
import { HelgolandMapViewModule } from '@helgoland/map/view';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FCM } from '@ionic-native/fcm';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';
import { DiagramPage } from '../pages/diagram/diagram';
import { MapPage } from '../pages/map/map';
import {
  LocalNotificationSettingsComponent,
} from '../pages/settings/local-notification-settings/local-notification-settings';
import { PushNotificationSettingsComponent } from '../pages/settings/push-notification-settings/push-notification-settings';
import { SettingsPage } from '../pages/settings/settings';
import { StartPage } from '../pages/start/start';
import { IrcelineSettingsProvider } from '../providers/irceline-settings/irceline-settings';
import { LayerGeneratorService } from '../providers/layer-generator/layer-generator';
import { LocalNotificationsProvider } from '../providers/local-notification/local-notification';
import { ModelledValueProvider } from '../providers/modelled-value/modelled-value';
import { NotificationPresenter } from '../providers/notification-presenter/notification-presenter';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';
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
    SettingsPage
  ],
  providers: [
    { provide: DatasetApiInterface, useClass: SplittedDataDatasetApiInterface },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: GeoSearch, useClass: NominatimGeoSearchService },
    { provide: SettingsService, useClass: JSSONSettingsService },
    BackgroundGeolocation,
    BackgroundMode,
    FCM,
    Geolocation,
    IrcelineSettingsProvider,
    LayerGeneratorService,
    LocalNotifications,
    LocalNotificationsProvider,
    ModelledValueProvider,
    NotificationPresenter,
    PushNotificationsProvider,
    SplashScreen,
    StatusBar,
    TimeseriesService,
  ]
})
export class AppModule { }
