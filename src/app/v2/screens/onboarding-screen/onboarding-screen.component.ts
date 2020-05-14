import { Component, OnInit } from '@angular/core';
import {
    UserNotificationSetting,
    NotificationType,
} from '../../components/user-notification-settings/user-notification-settings.component';
import { UserLocation } from '../../Interfaces';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import {UserSettingsService} from '../../services/user-settings.service';

@Component({
    selector: 'app-intro-screen',
    templateUrl: './onboarding-screen.component.html',
    styleUrls: ['./onboarding-screen.component.scss'],
})
export class OnboardingScreenComponent implements OnInit {
    // Setting default language to english
    // implementation task, fetch this from device settings
    language = 'e';
    btnText = 'Ga verder';
    sliderDisabled = false;

    userNotificationSettings: UserNotificationSetting[] = [];

    constructor(private navCtrl: NavController, private userSettingsService: UserSettingsService) {
        this.userNotificationSettings = userSettingsService.getUserNotificationSettings();
    }

    ngOnInit() {}

    updateUserLanguageSettings(language: string) {
        // implementation task
        console.log('todo: implement update user language settings');
        console.log(language);
    }

    updateUserLocationSettings(userLocation: UserLocation) {
        // implementation task
        console.log('todo: implement update user location settings');
        console.log(userLocation);
    }

    updateUserNotificationSettings(updatedSetting: UserNotificationSetting) {
        this.userSettingsService.updateUserNotificationSettings( updatedSetting );
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
