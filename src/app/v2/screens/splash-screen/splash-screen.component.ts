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
        public splashScreen: SplashScreen
    ) {}

    ionViewDidEnter() {
        this.splashScreen.hide();
    }
}
