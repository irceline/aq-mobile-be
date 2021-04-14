import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NavController, Platform } from '@ionic/angular';

import { UserLocation } from '../../Interfaces';
import { BelAQIService } from '../../services/bel-aqi.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';

@Component({
    selector: 'app-menu-screen',
    templateUrl: './menu-screen.component.html',
    styleUrls: ['./menu-screen.component.scss', './menu-screen.component.hc.scss'],
    animations: [
        trigger('menuAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateX(-100%)' }),
                animate(
                    '0ms',
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

    locationList: UserLocation[] = [];

    version = 'desktop';

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService,
        private userSettingsService: UserSettingsService,
        private appVersion: AppVersion,
        private platform: Platform,
        public themeService: ThemeHandlerService
    ) { }

    ngOnInit() {
        this.belAQIService.$activeIndex.subscribe((newIndex) => this.belAqi = newIndex?.indexScore);

        this.locationList = this.userSettingsService.getUserSavedLocations();

        this.userSettingsService.$userLocations.subscribe((userLocations) => {
            this.locationList = userLocations;
        });

        if (this.platform.is('cordova')) {
            this.appVersion.getVersionNumber().then(res => this.version = res);
        }
    }

    updateLocation(newLocations: UserLocation[]) {
        this.userSettingsService.updateUserLocationsOrder(newLocations);
    }

    updateLocationCoordinate(userLocation: UserLocation) {
        this.userSettingsService.updateUserLocationCoordinates(userLocation);
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

    async toggleTheme() {
        let currentTheme = await this.themeService.getActiveTheme()
        currentTheme = currentTheme === this.themeService.CONTRAST_MODE ? this.themeService.STANDARD_MODE : this.themeService.CONTRAST_MODE
        this.themeService.setActiveTheme(currentTheme)
    }
}
