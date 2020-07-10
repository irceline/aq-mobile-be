import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import locations from '../../../assets/locations.json';
import {
    NotificationType,
    UserNotificationSetting,
} from '../components/user-notification-settings/user-notification-settings.component';
import { UserLocation } from '../Interfaces';

const userNotificationLSkey = 'belAir.userNotificationSettings';
const userLocationsLSkey = 'belAir.userLocations';

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

    public $userLocations: BehaviorSubject<UserLocation[]>;

    private _selectedUserLocation: UserLocation;
    public get selectedUserLocation(): UserLocation {
        return this._selectedUserLocation
            ? this._selectedUserLocation
            : this._userLocations[0];
    }

    public set selectedUserLocation(ul: UserLocation) {
        this._selectedUserLocation = ul;
    }

    private _userLocations: UserLocation[] = [];

    constructor() {
        const notificationSettings = localStorage.getItem(
            userNotificationLSkey
        );
        if (notificationSettings) {
            // todo : some verification that the stored data is not corrupt
            this._currentNotificationSettings = JSON.parse(
                notificationSettings
            );
        } else {
            this._currentNotificationSettings = this._defaultNotificationSettings;
        }

        const userLocations = localStorage.getItem(userLocationsLSkey);

        if (userLocations) {
            // todo : some verification that the stored data is not corrupt
            this._userLocations = JSON.parse(userLocations).slice(0, 5);
        } else {
            const startPoint = Math.floor(
                Math.random() * (locations.length - 5)
            );
            // randomly return 5 locations before integration
            // @ts-ignore
            this._userLocations = locations.slice(startPoint, startPoint + 5);
        }

        this.$userLocations = new BehaviorSubject(this._userLocations);
    }

    public getUserSavedLocations(): UserLocation[] {
        return this._userLocations;
    }

    public addUserLocation(location: UserLocation) {
        this._userLocations.unshift(location);
        this.saveLocations();
    }

    public updateUserLocations(newLocations: UserLocation[]) {
        this._userLocations = newLocations;
        this.saveLocations();
    }

    private saveLocations() {
        this.$userLocations.next(this._userLocations);
        // todo: cloud storage?
        localStorage.setItem(
            userLocationsLSkey,
            JSON.stringify(this._userLocations)
        );
    }

    public removeUserLocation(locationToRemove: UserLocation) {
        this._userLocations = this._userLocations.filter(
            (l) => l.id !== locationToRemove.id
        );
        this.saveLocations();
    }

    public getUserNotificationSettings() {
        return this._currentNotificationSettings;
    }

    public updateUserNotificationSettings(
        updatedSetting: UserNotificationSetting
    ) {
        // todo...
    }
}
