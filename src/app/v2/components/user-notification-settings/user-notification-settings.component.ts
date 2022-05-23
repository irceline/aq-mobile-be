import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { indexLabel } from '../../common/constants';

import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { UserSettingsService } from './../../services/user-settings.service';

@Component({
    selector: 'app-user-notification-settings',
    templateUrl: './user-notification-settings.component.html',
    styleUrls: ['./user-notification-settings.component.scss', './user-notification-settings.component.hc.scss'],
})
export class UserNotificationSettingsComponent implements OnInit {

    @Output() getFocus = new EventEmitter<boolean>();
    @Output() loseFocus = new EventEmitter<boolean>();

    public generalNotification: boolean;
    public userLocationNotifications: boolean;
    public aqiScoreNotifications: number;
    public aqiScoreColor: string;
    public aqiIndexName: string;

    aqiThresholdDelayTimer?: any

    constructor(
        private generalNotificationSrvc: GeneralNotificationService,
        private userSettingsSrvc: UserSettingsService
    ) { }

    ngOnInit() {
        this.generalNotificationSrvc.$active.pipe(first()).subscribe(res => this.generalNotification = res);
        this.userSettingsSrvc.$userLocationNotificationsActive.pipe(first()).subscribe(res => this.userLocationNotifications = res);
        // @todo: get aqi score notif
        this.userSettingsSrvc.$userAqiIndexThreshold.subscribe(res => this.aqiScoreNotifications = res);
        this.aqiScoreColor = `aqi${this.aqiScoreNotifications}`
        this.aqiIndexName = indexLabel[this.aqiScoreNotifications]
    }

    toggleGeneralNotification(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (!this.generalNotification) {
            this.generalNotificationSrvc.subscribeNotification(true).subscribe(success => {
                if (success) {
                    this.generalNotification = !this.generalNotification;
                }
            });
        } else {
            if (this.userLocationNotifications) this.toggleUserLocationNotifications(event);
            this.generalNotificationSrvc.unsubscribeNotification(true).subscribe(success => {
                if (success) {
                    this.generalNotification = !this.generalNotification;
                }
            });
        }
    }

    toggleUserLocationNotifications(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (!this.generalNotification) this.toggleGeneralNotification(event);

        // Make sure the user sees the notification toggle changed first

        this.userSettingsSrvc.showLoading().then(async () => {
            await new Promise((resolve) => {
                if (!this.userLocationNotifications) {
                    this.userSettingsSrvc.subscribeNotification().subscribe(resolve);
                } else {
                    this.userSettingsSrvc.unsubscribeNotification().subscribe(resolve);
                }
            })

            this.userSettingsSrvc.dismissLoading()

            this.userLocationNotifications = !this.userLocationNotifications;
        });
    }

    hasFocus() {
        this.getFocus.next(true);
    }

    blurFocus() {
        this.loseFocus.next(false);
    }

    changeThresholdEnd(event) {
        // Update user AQI threshold to storage
        this.userSettingsSrvc.setUserAQIIndexThreshold(event.target.value)
        const locations = this.userSettingsSrvc.getUserSavedLocations()
        this.userSettingsSrvc.updateUserLocationsOrder(locations.map(location => ({
            ...location,
            indexThreshold: event.target.value
        })))
        if (this.userLocationNotifications) {
            // resubscribe to update the index AQI threshold
            this.userSettingsSrvc.showLoading()
                .then(() => {
                    this.userSettingsSrvc.subscribeNotification().subscribe(() => {
                        this.userSettingsSrvc.dismissLoading()
                    }, () => this.userSettingsSrvc.dismissLoading());
                }).catch(() => this.userSettingsSrvc.dismissLoading())
        }
    }

    changeThreshold(event) {
        this.aqiScoreNotifications = event.target.value
        this.aqiScoreColor = `aqi${event.target.value}`
        this.aqiIndexName = indexLabel[event.target.value]

        // // Update user AQI threshold to storage
        // if (this.aqiThresholdDelayTimer) clearTimeout(this.aqiThresholdDelayTimer)

        // this.aqiThresholdDelayTimer = setTimeout(() => {
        //     const locations = this.userSettingsSrvc.getUserSavedLocations()

        //     this.userSettingsSrvc.updateUserLocationsOrder(locations.map(location => ({
        //         ...location,
        //         indexThreshold: event.target.value
        //     })))

        //     if (this.userLocationNotifications) {
        //         // resubscribe to update the index AQI threshold
        //         this.userSettingsSrvc.subscribeNotification().subscribe();
        //     }
        // }, 500)
    }
}
