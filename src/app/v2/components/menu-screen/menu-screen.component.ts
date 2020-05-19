import {
    Component,
    HostBinding,
    Input,
    OnInit,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    NotificationType,
    UserNotificationSetting,
} from '../user-notification-settings/user-notification-settings.component';
import { NavController } from '@ionic/angular';
import { BelAQIService } from '../../services/bel-aqi.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-menu-screen',
    templateUrl: './menu-screen.component.html',
    styleUrls: ['./menu-screen.component.scss'],
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
export class MenuScreenComponent implements OnInit {
    @Output() menuClosed = new EventEmitter();

    @HostBinding('style.background-color')
    public backgroundColor;

    @Input()
    set belAqi(index: number) {
        this.backgroundColor = this.belAQIService.getLightColorForIndex(index);
    }

    @Input() menuVisible = false;

    // todo: user settings service get this from language settings
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
        private belAQIService: BelAQIService
    ) {
        belAQIService.$activeIndex.subscribe((newIndex) => {
            this.belAqi = newIndex.indexScore;
        });
    }

    ngOnInit() {}

    updateLocation(event) {
        console.log(event);
    }

    removeLocation(event) {
        console.log(event);
    }

    openAppInfo() {
        this.navCtrl.navigateForward(['main/app-info'], { animated: false });
        this.menuClosed.emit();
    }

    openLongTermInfo() {
        this.navCtrl.navigateForward(['main/longterm-info'], {
            animated: false,
        });
        this.menuClosed.emit();
    }
}
