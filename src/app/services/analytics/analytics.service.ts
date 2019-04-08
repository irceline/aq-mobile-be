import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private platform: Platform,
    private firebaseAnalytics: Firebase
  ) { }

  public logEvent(eventName: string, params: any = {}) {
    if (this.platform.is('cordova')) {
      this.firebaseAnalytics.logEvent(eventName, params)
        .then((res: any) => console.log(`Successful: ${res}`))
        .catch((error: any) => console.error(`Error: ${error}`));
    }
  }
}
