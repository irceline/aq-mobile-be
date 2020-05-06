import { Component, OnInit } from '@angular/core';
import {
    UserNotificationSetting,
    NotificationType,
} from '../../components/user-notification-settings/user-notification-settings.component';
import {UserLocation} from '../../Interfaces';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';

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

    // implementation task -> fetch user notification settings
    userSettings: UserNotificationSetting[] = [
        {
            notificationType: NotificationType.highConcentration,
            enabled: true,
        },
        {
            notificationType: NotificationType.transport,
            enabled: true,
        },
        {
            notificationType: NotificationType.activity,
            enabled: false,
        },
        {
            notificationType: NotificationType.allergies,
            enabled: true,
        },
        {
            notificationType: NotificationType.exercise,
            enabled: false,
        },
    ];

    constructor( private navCtrl: NavController ) {}

    ngOnInit() {}

    updateUserLanguageSettings( language: string ) {
        // implementation task
        console.log( 'todo: implement update user language settings' );
    }

    updateUserLocationSettings( userLocation: UserLocation ) {
        // implementation task
        console.log( 'todo: implement update user location settings' );
    }

    updateUserNotificationSettings( updatedSetting: UserNotificationSetting ) {
        // implementation task
        console.log( 'todo: implement update user notification settings' );
    }

    onboardingComplete() {
        // implementation task
        console.log( 'todo: implement user completed onboarding' );

        this.navCtrl.navigateForward('v2/main');
    }
}
