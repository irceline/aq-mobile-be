import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
    IonRouterOutlet,
    ModalController,
    NavController,
    Platform,
} from '@ionic/angular';

import { ErrorLoggingService } from './v2/services/error-logging.service';
import { PouchDBInitializerService } from './v2/services/pouch-db-initializer/pouch-db-initializer.service';
import { SplashScreenComponent } from './v2/screens/splash-screen/splash-screen.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        public router: Router,
        private pouchDbInit: PouchDBInitializerService,
        private modalCtrl: ModalController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            // this.statusBar.styleDefault();
            // this.errorLoggingSrvc.init();
            this.statusBar.show();
            // this.splashScreen.hide();
            this.pouchDbInit.init();

            const splash = await this.modalCtrl.create({
                component: SplashScreenComponent,
            });
            splash.present();
        });
    }
}
