import { Injectable } from '@angular/core';
import locations from '../../../assets/locations.json';
import { UserLocation } from '../Interfaces';
import { NotificationType, UserNotificationSetting } from '../components/user-notification-settings/user-notification-settings.component';

@Injectable({
    providedIn: 'root',
})
export class UserSettingsService {

    private _defaultNotificationSettings: UserNotificationSetting[] = [
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

    private _currentNotificationSettings: UserNotificationSetting[] = [];

    private _userLocations: UserLocation[] = [];

    constructor() {
        const notificationSettings = localStorage.getItem('belAir.userNotificationSettings');
        if ( notificationSettings ) {
            // todo : some verification that the stored data is not corrupt
            this._currentNotificationSettings = JSON.parse(notificationSettings);
        } else {
            this._currentNotificationSettings = this._defaultNotificationSettings;
        }

        const userLocations = localStorage.getItem('belAir.userLocations');

        if ( userLocations ) {
            // todo : some verification that the stored data is not corrupt
            this._userLocations = JSON.parse(userLocations);
        } else {
            const startPoint = Math.floor(Math.random() * (locations.length - 5));
            // randomly return 5 locations before integration
            // @ts-ignore
            this._userLocations = locations.slice(startPoint, startPoint + 5);
        }
    }

    public getUserSavedLocations(): UserLocation[] {
        return this._userLocations;
    }

    public addUserLocation( location: UserLocation ) {

    }

    public removeUserLocation( location: UserSettingsService ) {

    }

    public getUserNotificationSettings() {
        return this._defaultNotificationSettings;
    }

    public updateUserNotificationSettings(updatedSetting: UserNotificationSetting) {
        // todo...
    }
}
