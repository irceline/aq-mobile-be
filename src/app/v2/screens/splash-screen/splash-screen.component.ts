import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent {
    constructor(
        public splashScreen: SplashScreen,
        private modalCtrl: ModalController
    ) {}

    ionViewDidEnter() {
        this.splashScreen.hide();

        setTimeout(() => {
            this.modalCtrl.dismiss();
        }, 4000);
    }
}
