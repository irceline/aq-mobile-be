import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, forkJoin, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import locations from '../../../assets/locations.json';
import { UserLocation } from '../Interfaces';
import { UserLocationNotificationsService } from './user-location-notifications/user-location-notifications.service';

const userLocationsLSkey = 'belAir.userLocations';
const userAqiIndexThresholdKey = 'belAir.aqiIndexThreshold';

const userLocationNotificationsLSkey = 'belAir.userLocationNotifications';

@Injectable({
    providedIn: 'root',
})
export class UserSettingsService {

    public $userLocations: BehaviorSubject<UserLocation[]>;
    public $userAqiIndexThreshold: BehaviorSubject<number>;

    public $userLocationNotificationsActive: BehaviorSubject<boolean>;

    private _selectedUserLocation: UserLocation;
    private _loadingInstance: HTMLIonLoadingElement;
    private _toastInstance: HTMLIonToastElement;

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
        private userLocationNotificationSrvc: UserLocationNotificationsService,
        private translate: TranslateService,
        private loadingController: LoadingController,
        private toastController: ToastController,
    ) {
        this.$userLocationNotificationsActive = new BehaviorSubject(localStorage.getItem(userLocationNotificationsLSkey) === 'true');

        const userLocations = localStorage.getItem(userLocationsLSkey);
        const userAqiIndexThreshold = localStorage.getItem(userAqiIndexThresholdKey);

        console.log(`Got user AQI index threshold from localStorage:`, userAqiIndexThreshold);

        this.$userAqiIndexThreshold = new BehaviorSubject(userAqiIndexThreshold ? parseInt(userAqiIndexThreshold) : 6);

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

        this.translate.onLangChange.subscribe(() => {
            if (this.$userLocationNotificationsActive.getValue()) {
                this.showLoading()
                .then(() => {
                    this.unsubscribeNotification(true).subscribe(() => {
                        this.subscribeNotification().subscribe(this.dismissLoading.bind(this))
                    }, this.dismissLoading.bind(this));
                })
                .catch(() => this.dismissLoading())
            }
        });
    }

    public async showLoading() {
        this._loadingInstance = await this.loadingController.create({
            message: this.translate.instant(
                'v2.components.location-input.please-wait'
            ),
        });

        await this._loadingInstance.present();
    }

    private async showToast(message: string) {
        this._toastInstance = await this.toastController.create({
            message,
            duration: 3000,
        });

        this._toastInstance.present()
    }

    public async dismissLoading() {
        if (this._loadingInstance) {
            this._loadingInstance.dismiss()
            // this._loadingInstance.remove()
        }
    }

    public setUserAQIIndexThreshold(value: number): void {
        this.$userAqiIndexThreshold.next(value);
        localStorage.setItem(userAqiIndexThresholdKey, value.toString());
    }

    public getUserSavedLocations(): UserLocation[] {
        return this._userLocations;
    }

    public async addUserLocation(location: UserLocation) {
        if (location != null) {
            // Check if the location is duplicate
            if (this._userLocations.find(loc => loc.latitude === location.latitude && loc.longitude === location.longitude) != undefined) {
                return;
            };

            this._userLocations.unshift(location);

            if (this.$userLocationNotificationsActive.getValue()) {
                await this.showLoading()

                this.userLocationNotificationSrvc
                    .subscribeLocation(location, this.$userAqiIndexThreshold.value)
                    .subscribe(() => {
                        this.saveLocations()
                        this.dismissLoading()

                        this.showToast(this.translate.instant('v2.components.location-input.success-choose-location'))
                    },
                    async (err) => {
                        this.dismissLoading()
                        this._userLocations.shift()
                        console.log(`ERR: addUserLocation`, err)
                        this.showToast(this.translate.instant('v2.components.location-input.error-choose-location'))
                    }
                );
            } else {
                this.saveLocations();
            }
        }
    }

    public updateUserLocationsOrder(newLocations: UserLocation[]) {
        this._userLocations = newLocations;
        this.saveLocations();
    }

    public updateUserLocationCoordinates(userLocation: UserLocation) {
        const matchedLocation = this._userLocations.find(e => e.id === userLocation.id);
        matchedLocation.label = userLocation.label;
        matchedLocation.latitude = userLocation.latitude;
        matchedLocation.longitude = userLocation.longitude;
        if (this.$userLocationNotificationsActive.getValue()) {
            this.showLoading().then(() => {
                this.userLocationNotificationSrvc.unsubscribeLocation(matchedLocation).subscribe(() => {
                    this.userLocationNotificationSrvc.subscribeLocation(matchedLocation, this.$userAqiIndexThreshold.value).subscribe(this.dismissLoading);
                })
            })
        }
        this.saveLocations();
    }

    public async removeUserLocation(locationToRemove: UserLocation) {
        await this.showLoading()

        this._userLocations = this._userLocations.filter(
            (l) => l.id !== locationToRemove.id
        );
        if (this.$userLocationNotificationsActive.getValue()) {
            this.userLocationNotificationSrvc.unsubscribeLocation(locationToRemove).subscribe(
                () => {
                    this.saveLocations();
                    this.dismissLoading()
                },
                (err) => {
                    this.dismissLoading();
                    this.showToast(this.translate.instant('v2.components.location-input.error-remove-location'))
                }
            );
        } else {
            this.saveLocations();
            this.dismissLoading()
        }
    }

    public subscribeNotification(): Observable<boolean> {
        const subscriptions = this.$userLocations.getValue().map(uLoc => {
            return this.userLocationNotificationSrvc.subscribeLocation(uLoc, this.$userAqiIndexThreshold.value);
        });

        if (subscriptions.length === 0) {
            return of(false);
        }

        return forkJoin(subscriptions).pipe(
            catchError(error => {
                console.error(error);
                return of(false);
            }),
            map(() => true),
            tap(r => {
                this.saveLocations();
                return this.setUserLocationsNotificationsActive(r);
            }),
        );
    }

    public unsubscribeNotification(performUpdate: boolean = false): Observable<boolean> {
        const unsubscriptions = this.$userLocations.getValue().map(uLoc => this.userLocationNotificationSrvc.unsubscribeLocation(uLoc, performUpdate));

        if (unsubscriptions.length === 0) {
            return of(false);
        }

        return forkJoin(unsubscriptions).pipe(
            catchError(error => {
                console.error(error);
                return of(false);
            }),
            map(() => false),
            tap(res => {
                this.saveLocations();
                return this.setUserLocationsNotificationsActive(res);
            })
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
                const matchedUserLocation = this._userLocations.find(e => {
                    if (!e.subscription) {
                        return false
                    }

                    return String(e.subscription.lat) === String(notif.lat)
                        && String(e.subscription.lng) === String(notif.lng)
                });
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

                // set default user location
                this.selectedUserLocation = matchedUserLocation

                this.saveLocations();
            } else {
                console.log(`Notification expired`);
            }
        });

        this._userLocations.forEach(e => {
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
