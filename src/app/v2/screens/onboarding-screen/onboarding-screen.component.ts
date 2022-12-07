import { Component, NgZone, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NavController, Platform } from '@ionic/angular';

import { UserLocation } from '../../Interfaces';
import { UserSettingsService } from '../../services/user-settings.service';

@Component({
    selector: 'app-intro-screen',
    templateUrl: './onboarding-screen.component.html',
    styleUrls: ['./onboarding-screen.component.scss', './onboarding-screen.component.hc.scss'],
})
export class OnboardingScreenComponent implements OnInit {
    // implementation task, fetch this from device settings
    btnText = 'Ga verder';
    sliderDisabled = false;
    public keyboardShown = false;

    constructor(
        private navCtrl: NavController,
        private userSettingsService: UserSettingsService,
        private zone: NgZone,
        public keyboard: Keyboard,
        private splashScreen: SplashScreen,
        private platform: Platform
    ) {
        this.keyboard.onKeyboardShow().subscribe((e) => {
            this.zone.run(() => this.keyboardShown = true)
        })
        this.keyboard.onKeyboardHide().subscribe((e) => {
            this.zone.run(() => this.keyboardShown = false)
        })
        this.platform.ready().then(()=>{
            setTimeout(() => this.splashScreen.hide(), 1000)
        })
    }

    ngOnInit() {}

    confirmLocation(location: UserLocation) {
        if (location !== null) {
            this.userSettingsService.addUserLocation(location);
        }
    }

    onboardingComplete() {
        // implementation task
        console.log('todo: implement user completed onboarding');

        this.navCtrl.navigateForward('main');
    }

    getFocus(event: boolean) {
        this.sliderDisabled = event;
    }

    loseFocus(event: boolean) {
        this.sliderDisabled = event;
    }
}
