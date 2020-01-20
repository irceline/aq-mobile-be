import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { EncryptionService } from '../encryption/encryption.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { UserLocation } from '../user-location-list/user-location-list.service';
import { UserLocationTopicGeneratorService } from './user-location-topic-generator.service';

export interface LocationSubscription {
  lat: number;
  lng: number;
  language: string;
  index: number;
  key: string;
}

export enum UserLocationSubscriptionError {
  BackendRegistration,
  NotificationSubscription
}

const NOTIFICATION_SUBSCRIPTION_BACKEND_URL = 'https://www.irceline.be/air/belair_channel.php';
const USER_LOCATION_SUBSCRIPTIONS_PARAM = 'user_location_subscriptions';

@Injectable({
  providedIn: 'root'
})
export class UserLocationNotificationsService {

  private registeredSubscriptions: ReplaySubject<LocationSubscription[]> = new ReplaySubject(1);

  constructor(
    private notifications: PushNotificationsService,
    private encryption: EncryptionService,
    private http: HttpClient,
    private storage: Storage,
    private translate: TranslateService,
    private topicGenerator: UserLocationTopicGeneratorService
  ) {
    this.storage.get(USER_LOCATION_SUBSCRIPTIONS_PARAM)
      .then(res => this.registeredSubscriptions.next(res ? res : []))
      .catch(() => this.registeredSubscriptions.next([]));

    this.translate.onLangChange.subscribe(() => {
      this.registeredSubscriptions.subscribe(subs => {
        subs.forEach(e => {
          const loc: UserLocation = {
            type: 'user',
            latitude: e.lat,
            longitude: e.lng
          };
          this.unsubscribeLocation(loc).subscribe(res => {
            this.subscribeLocation(loc, e.index).subscribe();
          });
        });
      });
    });
  }

  public subscribeLocation(location: UserLocation, index: number): Observable<boolean> {
    const langCode = this.translate.currentLang;
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const subscription = this.generateSubscriptionObject(location.latitude, location.longitude, index, langCode);
      // register to Backend
      this.registerSubscription(subscription).subscribe(
        success => {
          if (success) {
            // subscribe to Topic
            const topic = this.topicGenerator.generateTopic(subscription);
            this.notifications.subscribeTopic(topic)
              .then(() => {
                this.addSubscription(subscription);
                observer.next(true);
                observer.complete();
              })
              .catch(() => this.publishError(observer, UserLocationSubscriptionError.NotificationSubscription));
          } else {
            this.publishError(observer, UserLocationSubscriptionError.BackendRegistration);
          }
        },
        () => this.publishError(observer, UserLocationSubscriptionError.BackendRegistration)
      );
    });
  }

  public unsubscribeLocation(location: UserLocation): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.getRegisteredSubscription(location).subscribe(registeredSubscription => {
        // unregister to Backend
        this.deleteSubscription(registeredSubscription).subscribe(
          success => {
            if (success) {
              const topic = this.topicGenerator.generateTopic(registeredSubscription);
              // unsubscribe to Topic
              this.notifications.unsubscribeTopic(topic)
                .then(val => {
                  // remove status of locale storage
                  this.removeSubscription(registeredSubscription);
                  observer.next(true);
                  observer.complete();
                })
                .catch(() => this.publishError(observer, UserLocationSubscriptionError.NotificationSubscription));
            } else {
              this.publishError(observer, UserLocationSubscriptionError.BackendRegistration);
            }
          },
          () => this.publishError(observer, UserLocationSubscriptionError.BackendRegistration)
        );
      });
    });
  }

  public isRegisteredSubscription(location: UserLocation): Observable<boolean> {
    return this.registeredSubscriptions.pipe(
      map(val => val.findIndex(e => e.lat === location.latitude && e.lng === location.longitude) > -1)
    );
  }

  private getRegisteredSubscription(location: UserLocation): Observable<LocationSubscription> {
    return this.registeredSubscriptions.pipe(
      map(val => val.find(e => e.lat === location.latitude && e.lng === location.longitude))
    );
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

  private generateSubscriptionObject(lat: number, lng: number, index: number, language: string): LocationSubscription {
    return {
      lat,
      lng,
      language,
      index,
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

  private addSubscription(subscription: LocationSubscription) {
    this.registeredSubscriptions.subscribe(value => {
      value.push(subscription);
      this.saveSubscriptions();
    });
  }

  private removeSubscription(subscription: LocationSubscription) {
    this.registeredSubscriptions.subscribe(subs => {
      const idx = subs.findIndex(e => e.key === subscription.key);
      if (idx >= 0) { subs.splice(idx, 1); }
      this.saveSubscriptions();
    });
  }

  private saveSubscriptions() {
    this.registeredSubscriptions.subscribe(value => this.storage.set(USER_LOCATION_SUBSCRIPTIONS_PARAM, value));
  }

}
