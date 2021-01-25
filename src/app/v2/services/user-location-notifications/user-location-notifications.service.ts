import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

const NOTIFICATION_SUBSCRIPTION_BACKEND_URL = 'https://www.irceline.be/air/belair_channel.php';
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
    private topicGenerator: UserLocationTopicGeneratorService
  ) {

    this.notifications.notificationReceived.subscribe(notification => {
      if (this.topicGenerator.isUserLocationTopic(notification.topic)) {
        const coords = this.topicGenerator.generateLatLngOfTopic(notification.topic);
        this.receivedUserLocationNotification.next({
          lat: coords.lat,
          lng: coords.lng,
          notification
        });
      }
    });
  }

  public subscribeLocation(location: UserLocation): Observable<boolean> {
    const langCode = this.translate.currentLang;
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const subscription = this.generateSubscriptionObject(location.latitude, location.longitude, langCode);
      // register to Backend
      this.registerSubscription(subscription).subscribe(
        success => {
          if (success) {
            // subscribe to Topic
            const topic = this.topicGenerator.generateTopic(location.latitude, location.longitude, langCode);
            this.notifications.subscribeTopic(topic).subscribe(
              () => {
                location.subscription = subscription;
                observer.next(true);
                observer.complete();
              },
              () => this.publishError(observer, UserLocationSubscriptionError.NotificationSubscription)
            )
          } else {
            this.publishError(observer, UserLocationSubscriptionError.BackendRegistration);
          }
        },
        error => this.publishError(observer, error)
      );
    });
  }

  public unsubscribeLocation(location: UserLocation): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      if (location.subscription) {
        const subscription: LocationSubscription = location.subscription;
        // unregister to Backend
        this.deleteSubscription(subscription).subscribe(
          success => {
            if (success) {
              const topic = this.topicGenerator.generateTopic(subscription.lat, subscription.lng, subscription.language);
              // unsubscribe to Topic
              this.notifications.unsubscribeTopic(topic).subscribe(
                () => {
                  location.subscription = null;
                  observer.next(true);
                  observer.complete();
                },
                () => this.publishError(observer, UserLocationSubscriptionError.NotificationSubscription)
              )
            } else {
              this.publishError(observer, UserLocationSubscriptionError.BackendRegistration);
            }
          },
          () => this.publishError(observer, UserLocationSubscriptionError.BackendRegistration)
        );
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }

  private registerSubscription(subscription: LocationSubscription): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const encriptedSubscription = this.encryption.encrypt(JSON.stringify(subscription));
      if (encriptedSubscription) {
        this.http.post(NOTIFICATION_SUBSCRIPTION_BACKEND_URL, encriptedSubscription, {
          observe: 'response',
          responseType: 'text'
        }).subscribe(
          response => {
            observer.next(response.status === 200);
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
      this.http.delete(`${NOTIFICATION_SUBSCRIPTION_BACKEND_URL}?key=${subscription.key}`, {
        observe: 'response',
        responseType: 'text'
      }).subscribe(
        response => {
          observer.next(response.status === 200);
          observer.complete();
        }, () => {
          observer.error(UserLocationSubscriptionError.BackendRegistration);
          observer.complete();
        });
    });
  }

  private publishError(observer: Observer<boolean>, error: UserLocationSubscriptionError) {
    observer.error(error);
    observer.complete();
  }

  private generateSubscriptionObject(lat: number, lng: number, language: string): LocationSubscription {
    return {
      lat,
      lng,
      language,
      key: this.generateKey()
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
