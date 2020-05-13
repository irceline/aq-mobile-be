import {
    Component,
    OnInit,
    ViewChild,
    HostBinding,
    Input,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { IonReorderGroup, NavController } from '@ionic/angular';
import {
    UserNotificationSetting,
    NotificationType,
} from '../user-notification-settings/user-notification-settings.component';
import { BelAQIService } from '../../services/bel-aqi.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger('menuAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateX(-100%)' }),
                animate(
                    '300ms',
                    style({ opacity: 1, transform: 'translateX(0)' })
                ),
            ]),
            transition(':leave', [
                animate(
                    '300ms',
                    style({ opacity: 0, transform: 'translateX(-100%)' })
                ),
            ]),
        ]),
    ],
})
export class HeaderComponent implements OnInit {
    @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

    @HostBinding('style.background-color')
    public backgroundColor;

    @Input()
    set belAqi(index: number) {
        this.backgroundColor = this.getBackgroundForIndex(index);
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

    constructor(
        private navCtrl: NavController,
        private belaqi: BelAQIService
    ) {}

    ngOnInit() {}

    getBackgroundForIndex(index: number) {
        this.belaqi.getLightColorForIndex(index);
    }

    openMenu() {
        this.visible = !this.visible;
    }

    updateLocation(event) {
        console.log(event);
    }

    removeLocation(event) {
        console.log(event);
    }

    openAppInfo() {
        this.navCtrl.navigateForward(['main/app-info'], { animated: false });
        this.visible = false;
    }

    openLongTermInfo() {
        this.navCtrl.navigateForward(['main/longterm-info'], {
            animated: false,
        });
        this.visible = false;
    }

    openRating() {
        this.navCtrl.navigateForward(['main/rating'], { animated: false });
    }
}
