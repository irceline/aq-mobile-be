import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HelgolandCachingModule } from '@helgoland/caching';
import { ApiInterface, GetDataApiInterface, SettingsService } from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction/datasetlist';
import { HelgolandFlotModule } from '@helgoland/flot';
import { GeoSearch, NominatimGeoSearchService } from '@helgoland/map';
import { HelgolandMapControlModule } from '@helgoland/map/control';
import { HelgolandMapSelectorModule } from '@helgoland/map/selector';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';
import { DiagramPage } from '../pages/diagram/diagram';
import { MapPage } from '../pages/map/map';
import { StartPage } from '../pages/start/start';
import { IrcelineSettingsProvider } from '../providers/irceline-settings/irceline-settings';
import { LayerGeneratorService } from '../providers/layer-generator/layer-generator';
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
    DiagramPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    HelgolandFlotModule,
    HelgolandDatasetlistModule,
    HelgolandCachingModule,
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
    DiagramPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: SettingsService, useClass: JSSONSettingsService },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: ApiInterface, useClass: GetDataApiInterface },
    { provide: GeoSearch, useClass: NominatimGeoSearchService },
    TimeseriesService,
    IrcelineSettingsProvider,
    LayerGeneratorService,
  ]
})
export class AppModule { }
