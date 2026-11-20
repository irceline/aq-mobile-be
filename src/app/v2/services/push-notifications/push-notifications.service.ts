import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import * as Sentry from '@sentry/angular';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import type { PluginListenerHandle } from '@capacitor/core';

type FcmListenerHandle = PluginListenerHandle;
import { App } from '@capacitor/app';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, of, ReplaySubject } from 'rxjs';

import { PendingNotificationService } from './pending-notification.service';

export interface PushNotification {
  topic: string;
  title: string;
  body: string;
  expiration: Date;
  location_name?: string;
  channel_id?: string;
  unique_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  public notificationReceived: ReplaySubject<PushNotification> = new ReplaySubject(1);

  public fcmToken!: string;
  public appVersion!: string;

  // FCM token + app version are fetched asynchronously in platform.ready().
  // Anything that needs the token (e.g. channel subscription payloads) must
  // await this promise instead of reading fcmToken synchronously, or the
  // payload can be sent with key=undefined before the token arrives.
  private fcmTokenReadyPromise: Promise<string> | null = null;
  private tokenReceivedHandle: FcmListenerHandle | null = null;
  private notificationReceivedHandle: FcmListenerHandle | null = null;
  private notificationActionPerformedHandle: FcmListenerHandle | null = null;
  private appVersionReadyPromise: Promise<string> | null = null;

  public get fcmTokenReady(): Promise<string> {
    if (this.fcmToken) return Promise.resolve(this.fcmToken);
    if (!this.fcmTokenReadyPromise) {
      this.fcmTokenReadyPromise = this.ensureNotificationPermission()
        .then(() => FirebaseMessaging.getToken())
        .then((token) => {
          this.fcmToken = token.token;
          return this.fcmToken;
        })
        .catch((e) => {
          this.fcmTokenReadyPromise = null; // allow retry on next call
          Sentry.captureMessage('FCM getToken failed (fcmTokenReady)', {
            level: 'error',
            extra: {
              error: String(e),
              isCapacitor: this.platform?.is?.('capacitor') ?? null
            }
          });
          throw e;
        });
    }
    return this.fcmTokenReadyPromise;
  }

  public get appVersionReady(): Promise<string> {
    if (this.appVersion) return Promise.resolve(this.appVersion);
    if (!this.appVersionReadyPromise) {
      this.appVersionReadyPromise = App.getInfo()
        .then((info) => (this.appVersion = info.version))
        .catch((e) => {
          this.appVersionReadyPromise = null; // allow retry on next call
          Sentry.captureMessage('App.getInfo failed (appVersionReady)', {
            level: 'error',
            extra: { error: String(e) }
          });
          throw e;
        });
    }
    return this.appVersionReadyPromise;
  }

  /**
   * FCM getToken() fails with "Unauthorized" when notification permission has
   * not been granted yet (iOS/Android). The permission prompt was previously
   * only requested inside subscribeTopic() — i.e. AFTER the backend
   * registration that already failed — so the first add-location with
   * notifications on always errored and the location was rolled back.
   * Request permission first so getToken() can succeed (NEB-777 fix follow-up).
   */
  public async ensureNotificationPermission(): Promise<void> {
    try {
      const permission = await FirebaseMessaging.checkPermissions();
      if (permission.receive === 'granted') return;
      const req = await FirebaseMessaging.requestPermissions();
      if (req.receive !== 'granted') {
        Sentry.captureMessage('Notification permission not granted during subscribe flow', {
          level: 'warning',
          extra: { receive: req.receive }
        });
        // keep going: getToken() will surface its own error and the
        // subscription flow will fall into the non-fatal path.
      }
    } catch (e) {
      // checkPermissions/requestPermissions can throw on web or unsynced
      // native builds — don't block the caller here.
      console.warn('ensureNotificationPermission failed:', String(e));
    }
  }

  /**
   * Resolves when fcmTokenReady settles (token or error). Rejects with a
   * timeout error if getToken() hangs — e.g. notification permission prompt
   * never answered, or the plugin is unavailable on web — so callers waiting
   * on the token can fail fast instead of blocking forever (infinite loading
   * spinner in subscription flows).
   */
  public async fcmTokenReadyWithTimeout(timeoutMs: number = 8000): Promise<string> {
    const started = Date.now();
    let timeoutId: any;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        const hasToken = !!this.fcmToken;
        const pending = this.fcmTokenReadyPromise !== null;
        Sentry.captureMessage('FCM token wait timed out', {
          level: 'warning',
          extra: {
            timeoutMs,
            hasToken,
            promisePending: pending,
            isCapacitor: this.platform?.is?.('capacitor') ?? null,
            waitedMs: Date.now() - started
          }
        });
        reject(new Error(`fcmTokenReady timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
    try {
      return await Promise.race([this.fcmTokenReady, timeout]);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  constructor(
    private platform: Platform,
    private nav: NavController,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private pendingNotification: PendingNotificationService,
  ) {
    // Register FCM listeners IMMEDIATELY, not inside platform.ready().
    // NEB-777 follow-up: on some cold boots Ionic's platform.ready() promise
    // never resolves (ready signal fires before Ionic subscribes), so the
    // .then() body never ran, no listeners were registered and every tap
    // logged "No listeners found for event notificationActionPerformed"
    // (verified 2026-11-20: native -> JS delivery works - injected test
    // listeners fired - while the app's own listeners were never registered).
    // The Capacitor bridge queues plugin calls until it is ready, so gating
    // addListener on platform.ready() is unnecessary. Only the token fetch
    // stays behind platform.ready().
    // NOTE: this.platform.is('capacitor') is UNRELIABLE here — services are
    // instantiated by Angular DI before Ionic finishes platform detection, so
    // it can return false and skip listener registration entirely (root cause
    // of the 2026-11-20 "No listeners found" investigation). Capacitor's own
    // synchronous check is safe at construction time.
    if (Capacitor.isNativePlatform()) {
      console.log('PushNotificationsService ctor: registering FCM listeners');
      this.registerFcmListeners()
        .then(() => console.log('PushNotificationsService ctor: FCM listeners registered OK'))
        .catch(e => console.error('PushNotificationsService ctor: registerFcmListeners FAILED', String(e)));

      // Re-register FCM listeners on every resume: the FirebaseMessaging
      // plugin's native listener registry does not survive an activity
      // stop/restart cycle (verified 2026-11-20: listeners registered in the
      // foreground were gone after Home -> reopen, same process/webview,
      // while listeners registered AFTER the last restart fired fine).
      // Without this, a notification tapped after a background/foreground
      // cycle logs "No listeners found for event notificationActionPerformed".
      App.addListener('appStateChange', (state) => {
        if (state.isActive) {
          this.registerFcmListeners();
        }
      });
    }

    this.platform.ready().then(() => {
      if (this.platform.is('capacitor')) {

        App.getInfo()
          .then((info) => {
            this.appVersion = info.version;
          })

        FirebaseMessaging.getToken().then((token) => {
          console.log('FCM Token', token.token);
          this.fcmToken = token.token
        });
      }
    });
  }

  /**
   * (Re-)register all FCM event listeners. Safe to call repeatedly: previous
   * handles are removed first so callbacks never run twice per event.
   */
  private async registerFcmListeners(): Promise<void> {
    console.log('registerFcmListeners: start');
    if (this.tokenReceivedHandle) {
      this.tokenReceivedHandle.remove();
      this.tokenReceivedHandle = null;
    }
    if (this.notificationReceivedHandle) {
      this.notificationReceivedHandle.remove();
      this.notificationReceivedHandle = null;
    }
    if (this.notificationActionPerformedHandle) {
      this.notificationActionPerformedHandle.remove();
      this.notificationActionPerformedHandle = null;
    }

    this.tokenReceivedHandle = await FirebaseMessaging.addListener('tokenReceived', (event) => {
      console.log('FCM new tokenReceived', event.token);
      this.fcmToken = event.token
    });

    this.notificationReceivedHandle = await FirebaseMessaging.addListener('notificationReceived', (event) => {
      console.log('notificationReceived', JSON.stringify(event.notification))
      const data = event.notification;
      const extraData:any = data.data;
      // since on latest android update foreground notif its not working, need to add local notif plugins
      if (data.title && data.body && extraData.expiration && extraData.topic) {
        const notification: PushNotification = {
          title: data.title,
          body: data.body,
          topic: extraData.topic,
          expiration: new Date(extraData.expiration),
          location_name: extraData?.location_name ?? '',
          unique_id: extraData?.unique_id ?? '',
          channel_id: extraData?.channel_id ?? ''
        };
        console.log(`New notification arrived (${extraData.topic}, ${data.title}, ${extraData.expiration})`);
        this.notificationReceived.next(notification);

        this.onNotifTapped(notification)
      }
    });

    // This handler on FCM background
    this.notificationActionPerformedHandle = await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
        console.log('notificationActionPerformed', JSON.stringify(event))

        const data = event.notification;
        const extraData: any = data.data;
        // since on latest android update foreground notif its not working, need to add local notif plugins
        if (extraData.title && extraData.body && extraData.expiration && extraData.topic) {
          const notification: PushNotification = {
            title: extraData.title,
            body: extraData.body,
            topic: extraData.topic,
            expiration: new Date(extraData.expiration),
            location_name: extraData?.location_name ?? '',
            unique_id: extraData?.unique_id ?? '',
            channel_id: extraData?.channel_id ?? ''
          };
          console.log(`New notification arrived from background(${extraData.topic}, ${data.title}, ${extraData.expiration})`);
          this.notificationReceived.next(notification);

          this.onNotifTapped(notification)
        } else {
          console.log('Notification handler failed, probably because title or body not exist on data');
          Sentry.captureMessage('Tapped notification payload incomplete', {
            level: 'warning',
            extra: {
              hasTitle: !!extraData.title,
              hasBody: !!extraData.body,
              hasExpiration: !!extraData.expiration,
              hasTopic: !!extraData.topic,
              dataKeys: extraData ? Object.keys(extraData) : null,
              notificationKeys: data ? Object.keys(data) : null
            }
          });
        }
      });
    console.log('registerFcmListeners: all 3 listeners registered');
  }

  public subscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android')) {

      FirebaseMessaging.checkPermissions().then((permission) => {
        console.log('FCM permission', permission.receive)
        if (permission.receive !== 'granted') {
          FirebaseMessaging.requestPermissions()
            .then((d) => {
              console.log('FCM request permission', d.receive)
              if(d.receive == 'denied') {
                console.log(`FCM request permission ${d.receive}`)
                console.log(`Opening app setting ...`);
                NativeSettings.open({
                  optionAndroid: AndroidSettings.AppNotification,
                  optionIOS: IOSSettings.App // for iOS only supportApp
                })
              }
            })
            .catch(error => console.error('FCM request permission ERR!', JSON.stringify(error)));
        }

        FirebaseMessaging.subscribeToTopic({ topic: topic })
          .then(() => {
            console.log(`subscribing to topic: ${topic} gave status: OK`);
          })
          .catch(error => console.error('subscribeTopic ERR!', JSON.stringify(error)));
      });

      return of(true);
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

  public unsubscribeTopic(topic: string): Observable<boolean> {
    if (this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android')) {
      FirebaseMessaging.unsubscribeFromTopic({ topic: topic })
        .then(() => {
          console.log(`unsubscribeFromTopic to topic: ${topic} gave status: OK`);
        })
        .catch(error => console.error('unsubscribeFromTopic ERR!', JSON.stringify(error)));
      return of(true);
    } else {
      console.error(`Push notifications are not supported`);
      return of(false);
    }
  }

  onNotifTapped(notification: PushNotification) {
    // Remember the tapped notification so the main screen can show it after
    // the navigation completes — on a cold start the session state the
    // popover used to read from doesn't exist yet (NEB-777).
    this.pendingNotification.set(notification);
    // Always route through the main screen: it consumes the pending
    // notification via PendingNotificationService and opens the popover
    // showing the (!) icon + message text (client expectation, NEB-777).
    // The former belair_ direct-alert branch bypassed this flow —
    // AlertController presented during cold-start bootstrap is unreliable,
    // and it left the app on the last screen without any message.
    // navigateRoot instead of navigateBack: on a cold start from the
    // notification tray there is no back stack yet.
    return this.zone.run(() => this.nav.navigateRoot('main', { queryParams: { popNotif: true } }));
  }
}
