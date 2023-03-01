import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Observable, of, ReplaySubject, Subscription, timer } from 'rxjs';
import { filter, first, map, mergeMap, reduce, tap } from 'rxjs/operators';

import { PushNotification, PushNotificationsService } from './push-notifications.service';

const NOTIFICATION_PREFIX = 'belair_';
const GENERAL_NOTIFICATION_STORAGE_KEY = 'GENERAL_NOTIFICATION_STORAGE_KEY';
const GENERAL_NOTIFICATION_TOPIC_STORAGE_KEY = 'GENERAL_NOTIFICATIOPN_TOPIC_STORAGE_KEY';
const ASKED_ENABLE_NOTIFICATION = 'ASKED_ENABLE_NOTIFICATION';

@Injectable({
  providedIn: 'root'
})
export class GeneralNotificationService {

  public notificationReceived: ReplaySubject<PushNotification> = new ReplaySubject(1);
  private expirationTimer: Subscription;

  public $active = new ReplaySubject<boolean>(1);

  constructor(
    private translate: TranslateService,
    private pushNotification: PushNotificationsService,
    private settingsSrvc: SettingsService<Settings>,
    private storage: Storage,
  ) {

    // sample notification for one minute:
    // this.setNotification({
    //   body: 'Door de vorming van secundair anorganisch fijn stof: fysico-chemische reacties in de atmosfeer via ammoniak (landbouw) en stikstofoxiden (verkeer, industrie en verwarming), lopen de fijnstofconcentraties hoog op. De informatiedrempel voor PM10 van 50 µg/m³ als 24-uursgemiddelde werd overschreden in Vlaanderen. De informatiefase is geactiveerd in Vlaanderen. In Brussel en Wallonië wordt de drempel op dit moment (nog) niet overschreden.',
    //   expiration: new Date(new Date().getTime() + 1000 * 60 * 1),
    //   title: 'Infomatiebericht fijn stof',
    //   topic: NOTIFICATION_PREFIX
    // });

    this.storage.get(GENERAL_NOTIFICATION_STORAGE_KEY).then((notif: PushNotification) => {
      if (notif) {
        notif.expiration = new Date(notif.expiration);
        this.setNotification(notif);
      }
    });

    this.pushNotification.notificationReceived.subscribe(notif => {
      if (notif.topic.startsWith(NOTIFICATION_PREFIX)) {
        this.setNotification(notif);
      }
    });

    from(this.storage.get(GENERAL_NOTIFICATION_TOPIC_STORAGE_KEY))
      .subscribe(res => this.$active.next(res ? true : false));

    this.translate.onLangChange.subscribe(lang => {
      this.$active.pipe(first()).subscribe(active => {
        if (active) {
          this.unsubscribeNotification(false).subscribe(() => this.subscribeNotification(false).subscribe());
        }
      });
    });
  }

  public getNotifications(): Observable<PushNotification> {
    return this.notificationReceived.asObservable();
  }

  public subscribeNotification(setActivation: boolean): Observable<boolean> {
    const topic = NOTIFICATION_PREFIX + this.translate.currentLang;
    return this.pushNotification.subscribeTopic(topic).pipe(
      tap(res => {
        this.storage.set(GENERAL_NOTIFICATION_TOPIC_STORAGE_KEY, topic);
        if (res && setActivation) {
          this.$active.next(true);
        }
      })
    );
  }

  public unsubscribeNotification(setDeactivation: boolean): Observable<boolean> {
    
    return of(this.settingsSrvc.getSettings().languages).pipe(
      mergeMap((languages) => {
        return forkJoin(languages.map(lang => {
          const topic = NOTIFICATION_PREFIX + lang.code;
          console.log(`unsubscribe from topic: ${topic}...`)
          return this.pushNotification.unsubscribeTopic(topic)
        }))
      }),
      reduce((_, val) => !val.includes(false), true),
      tap(res => {
        this.storage.remove(GENERAL_NOTIFICATION_TOPIC_STORAGE_KEY);
        if (res && setDeactivation) {
          this.$active.next(false);
        }
      }),
    )
  }

  private setNotification(notif: PushNotification) {
    console.log(`Try to set notification (${notif.title}, ${notif.expiration})`);
    if (notif.expiration.getTime() < new Date().getTime()) {
      console.log(`Notification expired`);
      this.storage.remove(GENERAL_NOTIFICATION_STORAGE_KEY);
      return;
    }
    this.notificationReceived.next(notif);
    this.storage.set(GENERAL_NOTIFICATION_STORAGE_KEY, notif);
    if (this.expirationTimer && !this.expirationTimer.closed) {
      this.expirationTimer.unsubscribe();
      this.storage.remove(GENERAL_NOTIFICATION_STORAGE_KEY);
    }
    this.expirationTimer = timer(notif.expiration).subscribe(() => {
      this.notificationReceived.next(null);
      this.storage.remove(GENERAL_NOTIFICATION_STORAGE_KEY);
      console.log(`Remove notification with expiration: ${notif.expiration}`);
    });
  }

  public setAskedEnableNotif(value) {
    this.storage.set(ASKED_ENABLE_NOTIFICATION, value)
  }

  public getAskedEnableNotif(): Promise<string> {
    return this.storage.get(ASKED_ENABLE_NOTIFICATION)
  }
}
