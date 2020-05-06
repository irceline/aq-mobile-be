import { Component, OnInit } from '@angular/core';
import {
    UserNotificationSetting,
    NotificationType,
} from '../../components/user-notification-settings/user-notification-settings.component';

@Component({
    selector: 'app-intro-screen',
    templateUrl: './onboarding-screen.component.html',
    styleUrls: ['./onboarding-screen.component.scss'],
})
export class OnboardingScreenComponent implements OnInit {
    language = 'e';
    btnText = 'Ga verder';

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

    constructor() {}

    ngOnInit() {}
}
