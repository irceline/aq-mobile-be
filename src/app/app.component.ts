import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonRouterOutlet, ModalController, Platform } from '@ionic/angular';

import { SplashScreenComponent } from './v2/screens/splash-screen/splash-screen.component';
import { NetworkAlertService } from './v2/services/network-alert/network-alert.service';
import { PouchDBInitializerService } from './v2/services/pouch-db-initializer/pouch-db-initializer.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        public router: Router,
        private pouchDbInit: PouchDBInitializerService,
        private modalCtrl: ModalController,
        private networkAlertSrvc: NetworkAlertService
    ) {
        this.initializeApp();
        this.registerBackButtonEvent();
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

    initializeApp() {
        this.platform.ready().then(async () => {
            // this.statusBar.styleDefault();
            // this.errorLoggingSrvc.init();
            this.statusBar.show();
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
