import { Injectable } from '@angular/core';

import { PushNotification } from './push-notifications.service';

/**
 * Transient holder for a push notification that arrived via a notification
 * TAP (notificationActionPerformed) and must be shown in the app after the
 * navigation to the main screen completes (NEB-777).
 *
 * Why this exists: the tap handler runs during app bootstrap on cold start,
 * BEFORE the services that fill session state (activeUserLocation.notification,
 * general notification memory) have processed anything. Reading that state at
 * popover time was the root cause of "tap opens the app but shows no message".
 * The tap event itself carries the full notification payload, so we hold it
 * here and the main screen consumes + clears it when it opens the popover.
 */
@Injectable({
  providedIn: 'root'
})
export class PendingNotificationService {

  private pending: PushNotification | null = null;

  set(notif: PushNotification): void {
    this.pending = notif;
  }

  /** Returns the pending notification (if any) and clears it — one-shot. */
  take(): PushNotification | null {
    const n = this.pending;
    this.pending = null;
    return n;
  }

  peek(): PushNotification | null {
    return this.pending;
  }
}
