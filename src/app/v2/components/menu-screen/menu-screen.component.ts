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
import { UserLocation } from '../../Interfaces';
import { UserSettingsService } from '../../services/user-settings.service';

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

    userNotificationSettings: UserNotificationSetting[] = [];

    locationList: UserLocation[] = [];

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService,
        private userSettingsService: UserSettingsService
    ) {
        belAQIService.$activeIndex.subscribe((newIndex) => {
            this.belAqi = newIndex.indexScore;
        });

        this.locationList = userSettingsService.getUserSavedLocations();

        this.userNotificationSettings = userSettingsService.getUserNotificationSettings();

        this.userSettingsService.$userLocations.subscribe((userLocations) => {
            this.locationList = userLocations;
        });
    }

    ngOnInit() {}

    updateLocation(newLocations: UserLocation[]) {
        this.userSettingsService.updateUserLocations(newLocations);
    }

    removeLocation(location: UserLocation) {
        this.userSettingsService.removeUserLocation(location);
    }

    addLocation(location: UserLocation | null) {
        if (location !== null) {
            this.userSettingsService.addUserLocation(location);
            this.locationList = this.userSettingsService.getUserSavedLocations();
        }
    }

    openAppInfo() {
        this.navCtrl.navigateForward(['main/app-info']);
        this.menuClosed.emit();
    }

    openLongTermInfo() {
        this.navCtrl.navigateForward(['main/longterm-info']);
        this.menuClosed.emit();
    }
}
