import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';

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

    constructor(
        private generalNotificationSrvc: GeneralNotificationService,
        private userSettingsSrvc: UserSettingsService
    ) { }

    ngOnInit() {
        this.generalNotificationSrvc.$active.pipe(first()).subscribe(res => this.generalNotification = res);
        this.userSettingsSrvc.$userLocationNotificationsActive.pipe(first()).subscribe(res => this.userLocationNotifications = res);
    }

    toggleGeneralNotification(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (!this.generalNotification) {
            this.generalNotificationSrvc.subscribeNotification(true);
        } else {
            this.generalNotificationSrvc.unsubscribeNotification(true);
        }
        this.generalNotification = !this.generalNotification;
    }

    toggleUserLocationNotifications(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (!this.userLocationNotifications) {
            this.userSettingsSrvc.subscribeNotification();
        } else {
            this.userSettingsSrvc.unsubscribeNotification();
        }
        this.userLocationNotifications = !this.userLocationNotifications;
    }

    hasFocus() {
        this.getFocus.next(true);
    }

    blurFocus() {
        this.loseFocus.next(false);
    }
}
