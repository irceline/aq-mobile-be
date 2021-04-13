import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { SplashScreenComponent } from './v2/screens/splash-screen/splash-screen.component';
import { NetworkAlertService } from './v2/services/network-alert/network-alert.service';
import { PouchDBInitializerService } from './v2/services/pouch-db-initializer/pouch-db-initializer.service';
import { ThemeHandlerService } from './v2/services/theme-handler/theme-handler.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    highContrastMode: Boolean = false;
    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        public router: Router,
        private pouchDbInit: PouchDBInitializerService,
        private modalCtrl: ModalController,
        private networkAlertSrvc: NetworkAlertService,
        private themeHandlerService: ThemeHandlerService
    ) {
        this.initializeApp();
        this.registerBackButtonEvent();
        this.handleTheme();
    }

    registerBackButtonEvent() {
        this.platform.backButton.subscribe(() => {
            this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
                if (this.router.url === '/main') {
                    navigator['app'].exitApp();
                }
            });
        });
    }

    handleTheme() {
        this.themeHandlerService.getActiveTheme().then(theme => {
            if (theme !== this.themeHandlerService.CONTRAST_MODE || !theme) {
                this.highContrastMode = false;
                this.themeHandlerService.setDefaultTheme();
            } else {
                this.highContrastMode = true;
            }
        })

        this.themeHandlerService.$theme.subscribe((item : any) => {
            if (item === this.themeHandlerService.CONTRAST_MODE) this.highContrastMode = true;
            else this.highContrastMode = false;
        })
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            // this.statusBar.styleDefault();
            // this.errorLoggingSrvc.init();
            this.statusBar.overlaysWebView(true);
            // this.splashScreen.hide();
            this.pouchDbInit.init();
            await this.presentSplashScreen();
        });

        this.networkAlertSrvc.isConnected.subscribe(connected => console.log(`Device has network connection: ${connected}`))
    }

    private async presentSplashScreen() {
        const splash = await this.modalCtrl.create({ component: SplashScreenComponent });
        splash.present();
        setTimeout(() => splash.dismiss(), 1500);
    }
}
