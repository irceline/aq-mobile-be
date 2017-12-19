import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  ApiInterface,
  CachingInterceptor,
  GetDataApiInterface,
  HttpCache,
  LocalHttpCache,
  LocalOngoingHttpCache,
  OnGoingHttpCache,
  SettingsService,
} from 'helgoland-toolbox';
import { HelgolandMapSelectorModule } from 'helgoland-toolbox/dist/components/map/selector/selector.module';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { DiagramPage } from '../pages/diagram/diagram';
import { MapPage } from '../pages/map/map';
import { MyApp } from './app.component';
import { JSSONSettingsService } from './services/settings.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    DiagramPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HelgolandMapSelectorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    DiagramPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: SettingsService, useClass: JSSONSettingsService },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    { provide: HttpCache, useClass: LocalHttpCache },
    { provide: OnGoingHttpCache, useClass: LocalOngoingHttpCache },
    { provide: ApiInterface, useClass: GetDataApiInterface }
  ]
})
export class AppModule { }
