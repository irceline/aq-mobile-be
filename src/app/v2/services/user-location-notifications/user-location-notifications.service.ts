import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
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

// const NOTIFICATION_SUBSCRIPTION_BACKEND_URL = 'https://www.irceline.be/air/belair_channel.php';
// TODO change this later when test complete
const NOTIFICATION_SUBSCRIPTION_BACKEND_URL = 'http://52.59.34.103:8086/belair_channel.php';
// const NOTIFICATION_SUBSCRIPTION_BACKEND_URL = 'http://192.168.0.7:8086/belair_channel.php';
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
    private platform: Platform
  ) {

    this.notifications.notificationReceived.subscribe(notification => {
      if (this.topicGenerator.isUserLocationTopic(notification.topic)) {
        const coords = this.topicGenerator.generateLatLngOfTopic(notification.topic);
        this.receivedUserLocationNotification.next({
          lat: coords.lat,
          lng: coords.lng,
          notification
        });
        this.platform.resume.subscribe(() => this.nav.navigateBack('main', { queryParams: { notification: notification } }))
      }
    });
  }

  public subscribeLocation(location: UserLocation, index: number = null): Observable<boolean> {
    const langCode = this.translate.currentLang;
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const subscription = this.generateSubscriptionObject(location.latitude, location.longitude, langCode, index, location.subscription ? location.subscription.uniqueId : null);

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
          observer.error(UserLocationSubscriptionError.BackendRegistration);
          observer.complete();
        });
    });
  }

  private publishError(observer: Observer<boolean>, error: UserLocationSubscriptionError) {
    observer.error(error);
    observer.complete();
  }

  private generateSubscriptionObject(lat: number, lng: number, language: string, index: number, uniqueId: string = null): LocationSubscription {
    return {
      lat,
      lng,
      language,
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
