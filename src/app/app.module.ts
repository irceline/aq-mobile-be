import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { HelgolandCoreModule, SettingsService } from '@helgoland/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
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
import { AutoCompleteModule } from 'ionic4-auto-complete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageHandlerService, languageInitializerFactory } from './v2/services/language-handler/language-handler.service';
import { JSSONSettingsService } from './v2/services/settings/settings.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        AutoCompleteModule,
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
                TranslateService,
                Injector,
                LanguageHandlerService,
                SettingsService,
            ],
            multi: true,
        },
        AppVersion,
        Diagnostic,
        FirebaseX,
        Geolocation,
        InAppBrowser,
        Keyboard,
        LanguageHandlerService,
        LocationAccuracy,
        Network,
        SplashScreen,
        StatusBar
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
