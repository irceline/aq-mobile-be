import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import locations from '../../../assets/locations.json';
import { UserLocation } from '../Interfaces';
import { UserLocationNotificationsService } from './user-location-notifications/user-location-notifications.service';

const userLocationsLSkey = 'belAir.userLocations';

const userLocationNotificationsLSkey = 'belAir.userLocationNotifications';

@Injectable({
    providedIn: 'root',
})
export class UserSettingsService {

    public $userLocations: BehaviorSubject<UserLocation[]>;

    public $userLocationNotificationsActive: BehaviorSubject<boolean>;

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

    private notificationExpirationTimer: Map<number, Subscription> = new Map();

    constructor(
        private userLocationNotificationSrvc: UserLocationNotificationsService
    ) {
        this.$userLocationNotificationsActive = new BehaviorSubject(localStorage.getItem(userLocationNotificationsLSkey) ? true : false);

        const userLocations = localStorage.getItem(userLocationsLSkey);

        if (userLocations) {
            // todo : some verification that the stored data is not corrupt
            this._userLocations = JSON.parse(userLocations).slice(0, 5);
            this._userLocations.forEach(e => {
                if (e.notification && e.notification.expiration) {
                    e.notification.expiration = new Date(e.notification.expiration)
                }
            })
        } else {
            const startPoint = Math.floor(
                Math.random() * (locations.length - 5)
            );
            // randomly return 5 locations before integration
            // @ts-ignore
            this._userLocations = locations.slice(startPoint, startPoint + 0);
        }

        this.$userLocations = new BehaviorSubject(this._userLocations);

        this.registerNotificationHandling();

        // TODO: language dependent notifications
        // this.translate.onLangChange.subscribe(() => {
        //   this.registeredSubscriptions.subscribe(subs => {
        //     subs.forEach(e => {
        //       const loc: UserLocation = {
        //         type: 'user',
        //         latitude: e.lat,
        //         longitude: e.lng
        //       };
        //       this.unsubscribeLocation(loc).subscribe(res => {
        //         this.subscribeLocation(loc).subscribe();
        //       });
        //     });
        //   });
        // });
    }

    public getUserSavedLocations(): UserLocation[] {
        return this._userLocations;
    }

    public addUserLocation(location: UserLocation) {
        if (location != null) {
            // Check if the location is duplicate
            if (this._userLocations.find(loc => loc.latitude === location.latitude && loc.longitude === location.longitude) != undefined) {
                return;
            };
            this._userLocations.unshift(location);
            if (this.$userLocationNotificationsActive.getValue()) {
                this.userLocationNotificationSrvc.subscribeLocation(location).subscribe(res => this.saveLocations());
            } else {
                this.saveLocations();
            }
        }
    }

    public updateUserLocations(newLocations: UserLocation[]) {
        this._userLocations = newLocations;
        this.saveLocations();
    }

    public updateUserLocationCoordinates() {
        if (this.$userLocationNotificationsActive.getValue()) {
            // this.userLocationNotificationSrvc.unsubscribe(); // TODO: old one
            // this.userLocationNotificationSrvc.subscribe(); // TODO: new one
        }
    }

    public removeUserLocation(locationToRemove: UserLocation) {
        this._userLocations = this._userLocations.filter(
            (l) => l.id !== locationToRemove.id
        );
        if (this.$userLocationNotificationsActive.getValue()) {
            this.userLocationNotificationSrvc.unsubscribeLocation(locationToRemove).subscribe(() => {
                this.saveLocations();
            });
        } else {
            this.saveLocations();
        }
    }

    public subscribeNotification(): Observable<boolean> {
        const subscriptions = this.$userLocations.getValue().map(uLoc => this.userLocationNotificationSrvc.subscribeLocation(uLoc));
        return forkJoin(subscriptions).pipe(
            catchError(error => {
                console.error(error);
                return of(false);
            }),
            map(() => true),
            tap(r => this.setUserLocationsNotificationsActive(r)),
        );
    }

    public unsubscribeNotification(): Observable<boolean> {
        const unsubscriptions = this.$userLocations.getValue().map(uLoc => this.userLocationNotificationSrvc.unsubscribeLocation(uLoc));
        return forkJoin(unsubscriptions).pipe(
            catchError(error => {
                console.error(error);
                return of(false);
            }),
            map(() => false),
            tap(res => this.setUserLocationsNotificationsActive(res))
        )
    }

    private setUserLocationsNotificationsActive(active: boolean) {
        localStorage.setItem(userLocationNotificationsLSkey, active + '');
        this.$userLocationNotificationsActive.next(active);
    }

    private saveLocations() {
        this.$userLocations.next(this._userLocations);
        // todo: cloud storage?
        localStorage.setItem(
            userLocationsLSkey,
            JSON.stringify(this._userLocations)
        );
    }

    private registerNotificationHandling() {
        this.userLocationNotificationSrvc.receivedUserLocationNotification.subscribe(notif => {
            if (notif.notification.expiration.getTime() > new Date().getTime()) {
                console.log(`receive Notification: ${notif.notification.topic}`);
                const matchedUserLocation = this._userLocations.find(e => e.latitude === notif.lat && e.longitude === notif.lng);
                console.log(`found match '${matchedUserLocation.label}' for notification`);
                matchedUserLocation.notification = notif.notification;
                if (this.notificationExpirationTimer.has(matchedUserLocation.id)) {
                    const t = this.notificationExpirationTimer.get(matchedUserLocation.id);
                    if (!t.closed) {
                        t.unsubscribe();
                        this.notificationExpirationTimer.delete(matchedUserLocation.id);
                    }
                }
                const expirationTimer = timer(notif.notification.expiration).subscribe(() => this.clearNotification(matchedUserLocation));
                this.notificationExpirationTimer.set(matchedUserLocation.id, expirationTimer);
                this.saveLocations();
            } else {
                console.log(`Notification expired`);
            }
        });

        this._userLocations.forEach(e => {
            console.log(`Check userLocation: ${e.label} - ${e.notification?.topic}`);
            if (e.notification?.expiration.getTime() > new Date().getTime()) {
                if (e.notification) {
                    this.notificationExpirationTimer.set(e.id, timer(e.notification.expiration).subscribe(() => this.clearNotification(e)));
                }
            } else {
                e.notification = null;
            }
        });
        this.saveLocations();
    }

    private clearNotification(ul: UserLocation) {
        console.log(`Clear expired notification ${ul.notification.topic}`);
        ul.notification = null;
        this.notificationExpirationTimer.delete(ul.id);
    }

}
