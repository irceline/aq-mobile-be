import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import CryptoJS from 'crypto-js';

const FIREBASE_REMOTE_CONFIG_KEY = 'feedback_key';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private key: CryptoJS.WordArray;

  constructor(
    private firebase: FirebaseX,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.firebase.fetch(600)
          .then(() => {
            this.firebase.activateFetched().then(() => {
              this.firebase.getValue(FIREBASE_REMOTE_CONFIG_KEY)
                .then(key => {
                  console.log(`Fetched key from firebase: '${key}'`);
                  return this.key = CryptoJS.enc.Base64.parse(key);
                })
                // TODO: error handling!
                .catch((error: any) => console.error(error));
            });
          })
          .catch();
      }
    });
  }

  public encrypt(data: string): string {
    if (this.key) {
      // console.log(`Encode data ${JSON.stringify(data, null, 0)} with key '${this.key.toString(CryptoJS.enc.Base64)}'`);
      const iv = CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(8));
      const cyphertext_raw = CryptoJS.AES.encrypt(data, this.key, { iv: iv, mode: CryptoJS.mode.CBC });
      const hmac = CryptoJS.HmacSHA256(cyphertext_raw.toString(), this.key.toString(CryptoJS.enc.Base64));
      const result = btoa(
        atob(iv.toString(CryptoJS.enc.Base64))
        + hmac.toString(CryptoJS.enc.Hex)
        + atob(cyphertext_raw.toString()
        ));
      return result;
    }
    return null;
  }

}
