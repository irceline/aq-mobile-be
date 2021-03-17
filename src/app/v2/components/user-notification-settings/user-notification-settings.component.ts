import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { AutomatedNotificationService } from '../../services/push-notifications/automated-notification.service';

marker('v2.components.user-notification-settings.exercise');
marker('v2.components.user-notification-settings.allergies');
marker('v2.components.user-notification-settings.activity');
marker('v2.components.user-notification-settings.transport');
marker('v2.components.user-notification-settings.highConcentration');

export interface UserNotificationSetting {
    notificationType: NotificationType;
    enabled: boolean;
    label?: string;
    icon?: string;
}

// !important, these enum strings are also used on translation files
export enum NotificationType {
    exercise = 'exercise',
    allergies = 'allergies',
    activity = 'activity',
    transport = 'transport',
    highConcentration = 'highConcentration',
}

@Component({
    selector: 'app-user-notification-settings',
    templateUrl: './user-notification-settings.component.html',
    styleUrls: ['./user-notification-settings.component.scss'],
})
export class UserNotificationSettingsComponent implements OnInit {
    private _userSettings: UserNotificationSetting[];

    private _icons = {
        [NotificationType.exercise]: '/assets/images/icons/sport.svg',
        [NotificationType.allergies]: '/assets/images/icons/allergenen.svg',
        [NotificationType.activity]: '/assets/images/icons/inspanning.svg',
        [NotificationType.transport]: '/assets/images/icons/wheel.svg',
        [NotificationType.highConcentration]:
            '/assets/images/icons/concentraties.svg',
    };

    @Input()
    set userSettings(settings: UserNotificationSetting[]) {
        this._userSettings = settings.map((s) => ({
            // get translations
            ...s,
            label: this.translate.instant(
                `v2.components.user-notification-settings.${s.notificationType}`
            ),
            icon: this._icons[s.notificationType],
        }));
    }

    get userSettings() {
        return this._userSettings;
    }

    @Output() settingChanged = new EventEmitter<UserNotificationSetting>();
    @Output() getFocus = new EventEmitter<boolean>();
    @Output() loseFocus = new EventEmitter<boolean>();

    public generalNotification: boolean;
    public automatedNotification: boolean;

    constructor(
        private translate: TranslateService,
        private generalNotificationSrvc: GeneralNotificationService,
        private automatedNotificationSrvc: AutomatedNotificationService
    ) { }

    ngOnInit() {
        this.generalNotificationSrvc.$active.pipe(first()).subscribe(res => this.generalNotification = res);
        this.automatedNotificationSrvc.$active.pipe(first()).subscribe(res => this.automatedNotification = res);
    }

    toggleGeneralNotification(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (!this.generalNotification) {
            this.generalNotificationSrvc.subscribeNotification().subscribe(res => {
                return this.generalNotification = res;
            });
        } else {
            this.generalNotificationSrvc.unsubscribeNotification().subscribe(res => {
                return this.generalNotification = !res;
            });
        }
    }

    toggleAutomatedNotification(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        if (!this.automatedNotification) {
            this.automatedNotificationSrvc.subscribeNotification().subscribe(res => {
                return this.automatedNotification = res;
            });
        } else {
            this.automatedNotificationSrvc.unsubscribeNotification().subscribe(res => {
                return this.automatedNotification = !res;
            });
        }
    }

    changeSetting(setting: UserNotificationSetting) {
        setting.enabled = !setting.enabled;
        this.settingChanged.emit(setting);
    }

    hasFocus() {
        this.getFocus.next(true);
    }

    blurFocus() {
        this.loseFocus.next(false);
    }
}
