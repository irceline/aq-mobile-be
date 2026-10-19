import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer, Subject } from 'rxjs';

import { LocationSubscription, UserLocation } from '../../Interfaces';
import { EncryptionService } from '../encryption/encryption.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { PushNotification } from './../push-notifications/push-notifications.service';
import { UserLocationTopicGeneratorService } from './user-location-topic-generator.service';

export enum UserLocationSubscriptionError {
  BackendRegistration,
  NotificationSubscription
}

export interface UserLocationNotification {
  lat: number;
  lng: number;
  notification: PushNotification
}

const NOTIFICATION_SUBSCRIPTION_BACKEND_URL = 'https://geobelair.irceline.be/air/belair_channel.php';
const USER_LOCATION_SUBSCRIPTIONS_PARAM = 'user_location_subscriptions';

@Injectable({
  providedIn: 'root'
})
export class UserLocationNotificationsService {

  public receivedUserLocationNotification: Subject<UserLocationNotification> = new Subject();

  constructor(
    private notifications: PushNotificationsService,
    private encryption: EncryptionService,
    private http: HttpClient,
    private translate: TranslateService,
    private topicGenerator: UserLocationTopicGeneratorService,
    private nav: NavController,
    private zone: NgZone
  ) {

    this.notifications.notificationReceived.subscribe(notification => {
      if (this.topicGenerator.isUserLocationTopic(notification.topic)) {
        const coords = this.topicGenerator.generateLatLngOfTopic(notification.topic);
        this.receivedUserLocationNotification.next({
          // @ts-ignore
          lat: coords.lat,
          // @ts-ignore
          lng: coords.lng,
          notification
        });
      }
    });
  }

  // @ts-ignore
  public subscribeLocation(location: UserLocation, index: number = null): Observable<boolean> {
    const langCode = this.translate.currentLang;
    return new Observable<boolean>((observer: Observer<boolean>) => {
      // @ts-ignore
      const subscription = this.generateSubscriptionObject(location.latitude, location.longitude, location.label, langCode, index, location.subscription ? location.subscription.uniqueId : null);

      // register to Backend
      this.registerSubscription(subscription).subscribe(
        (data: any) => {
          if (data) {
            // subscribe to Topic
            const topic = this.topicGenerator.generateTopic(data.lat, data.lng, langCode);
            this.notifications.subscribeTopic(topic).subscribe(
              () => {
                location.subscription = {
                  ...data,
                  uniqueId: data.unique_id
                };

                observer.next(true);
                observer.complete();
              },
              () => this.publishError(observer, UserLocationSubscriptionError.NotificationSubscription)
            )
          } else {
            console.log(`registerSubscription failed`, subscription);
            this.publishError(observer, UserLocationSubscriptionError.BackendRegistration);
          }
        },
        error => {
          Sentry.captureMessage('Location subscribe: backend registration failed', {
            level: 'error',
            extra: { uniqueId: subscription.uniqueId, lat: subscription.lat, lng: subscription.lng }
          });
          this.publishError(observer, error);
        }
      );
    });
  }

  public unsubscribeLocation(location: UserLocation, performUpdate: boolean = false): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const langCode = this.translate.currentLang;

      // Always release the FCM topic, even when the backend registration could
      // not be deleted: a failed backend delete must never leave the device
      // subscribed to push notifications for a removed/changed location (NEB-613).
      const unsubscribeTopic = (lat: number, lng: number, language: string) => {
        const topic = this.topicGenerator.generateTopic(lat, lng, language);
        // unsubscribe from Topic
        this.notifications.unsubscribeTopic(topic).subscribe(
          () => {
            // @ts-ignore
            location.subscription = null;
            observer.next(true);
            observer.complete();
          },
          error => {
            Sentry.captureMessage('Location unsubscribe: FCM topic unsubscribe failed', {
              level: 'error',
              extra: { topic, hadSubscription: !!location.subscription, performUpdate }
            });
            this.publishError(observer, UserLocationSubscriptionError.NotificationSubscription);
          }
        )
      };

      if (location.subscription) {
        const subscription: LocationSubscription = location.subscription;

        if (performUpdate) {
          // Language-change flow: only the FCM topic needs to be released.
          unsubscribeTopic(subscription.lat, subscription.lng, subscription.language);
        } else {
          // unregister from Backend, then release the topic either way so a
          // failed backend delete can't leave a stale subscription behind.
          this.deleteSubscription(subscription).subscribe(
            () => unsubscribeTopic(subscription.lat, subscription.lng, subscription.language),
            () => unsubscribeTopic(subscription.lat, subscription.lng, subscription.language)
          );
        }
      } else {
        // No stored subscription info; best-effort release of the topic built
        // from the location coordinates so stale topic subscriptions can't
        // keep producing notifications (NEB-613).
        if (location.latitude != null && location.longitude != null) {
          unsubscribeTopic(location.latitude, location.longitude, langCode);
        } else {
          observer.next(true);
          observer.complete();
        }
      }
    });
  }

  private registerSubscription(subscription: LocationSubscription): Observable<LocationSubscription> {
    return new Observable<LocationSubscription>((observer: Observer<any>) => {

      const encriptedSubscription = this.encryption.encrypt(JSON.stringify(subscription));
      if (encriptedSubscription) {
        this.http.post(NOTIFICATION_SUBSCRIPTION_BACKEND_URL, encriptedSubscription, {
          observe: 'response',
          responseType: 'text'
        }).subscribe(
          response => {
            observer.next(typeof response.body === 'string' ? JSON.parse(response.body) : null);
            observer.complete();

          }, () => {
            observer.error(UserLocationSubscriptionError.BackendRegistration);
            observer.complete();
          });
      } else {
        observer.error(UserLocationSubscriptionError.BackendRegistration);
        observer.complete();
      }
    });
  }

  private deleteSubscription(subscription: LocationSubscription): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.http.delete(`${NOTIFICATION_SUBSCRIPTION_BACKEND_URL}?key=${subscription.key}&uniqueId=${subscription.uniqueId}`, {
        observe: 'response',
        responseType: 'text'
      }).subscribe(
        response => {
          observer.next(response.status === 200);
          observer.complete();
        }, () => {
          Sentry.captureMessage('Location unsubscribe: backend DELETE failed', {
            level: 'error',
            extra: { uniqueId: subscription.uniqueId, keyMatchesCurrentToken: subscription.key === this.notifications.fcmToken }
          });
          observer.error(UserLocationSubscriptionError.BackendRegistration);
          observer.complete();
        });
    });
  }

  private publishError(observer: Observer<boolean>, error: UserLocationSubscriptionError) {
    observer.error(error);
    observer.complete();
  }

  // @ts-ignore
  private generateSubscriptionObject(lat: number, lng: number, label: string, language: string, index: number, uniqueId: string = null): LocationSubscription {
    return {
      lat,
      lng,
      language,
      location_name: label,
      index,
      key: this.notifications.fcmToken,
      version: this.notifications.appVersion,
      uniqueId: uniqueId ? uniqueId : this.generateKey()
    };
  }

  private generateKey(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
