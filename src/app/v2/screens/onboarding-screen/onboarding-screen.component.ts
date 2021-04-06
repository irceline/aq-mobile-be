import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { UserLocation } from '../../Interfaces';
import { UserSettingsService } from '../../services/user-settings.service';

@Component({
    selector: 'app-intro-screen',
    templateUrl: './onboarding-screen.component.html',
    styleUrls: ['./onboarding-screen.component.scss'],
})
export class OnboardingScreenComponent implements OnInit {

    // implementation task, fetch this from device settings
    btnText = 'Ga verder';
    sliderDisabled = false;

    constructor(
        private navCtrl: NavController,
        private userSettingsService: UserSettingsService
    ) { }

    ngOnInit() { }

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
