import {
    Component,
    OnInit,
    ViewChild,
    HostBinding,
    Input,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { IonReorderGroup } from '@ionic/angular';
import {
    UserNotificationSetting,
    NotificationType,
} from '../user-notification-settings/user-notification-settings.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger('menuAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('100ms', style({ opacity: 1 })),
            ]),
            transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
        ]),
    ],
})
export class HeaderComponent implements OnInit {
    @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

    public backgroundColor;

    @Input()
    set belAqi(index: number) {
        this.backgroundColor = HeaderComponent.getBackgroundForIndex(index);
    }

    visible = false;
    language = 'e';
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

    locationList: any[] = [
        { name: 'Koksijde', id: 'abc', order: 1 },
        { name: 'Herent', id: 'def', order: 2 },
    ];

    private static getBackgroundForIndex(index: number) {
        switch (index) {
            case 1:
                return '#822e45';
            case 2:
                return '#c72955';
            case 3:
                return '#ff4a2e';
            case 4:
                return '#ff812e';
            case 5:
                return '#ff9609';
            case 6:
                return '#f0d426';
            case 7:
                return '#2df16b';
            case 8:
                return '#30e14d';
            case 9:
                return '#29cdf7';
            case 10:
                return '#238cff';
            default:
                return null;
        }
    }

    constructor() {}

    ngOnInit() {}

    openMenu() {
        this.visible = !this.visible;
    }

    updateLocation(event) {
        console.log(event);
    }

    removeLocation(event) {
        console.log(event);
    }
}
