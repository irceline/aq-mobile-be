import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics
  ) { }

  public logEvent(eventName: string, params: any = {}) {
    if (this.platform.is('cordova')) {
      this.firebaseAnalytics.logEvent(eventName, params)
        .then((res: any) => console.log(`Successful: ${res}`))
        .catch((error: any) => console.error(`Error: ${error}`));
    }
  }
}
