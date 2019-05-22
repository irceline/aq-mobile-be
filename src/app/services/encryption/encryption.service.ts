import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private key: CryptoJS.WordArray;

  constructor(
    private firebase: Firebase,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.firebase.fetch(600)
          .then(() => {
            this.firebase.activateFetched().then(() => {
              this.firebase.getValue('subscription_key', 'belair')
                .then((res: any) => this.key = CryptoJS.enc.Base64.parse(res))
                // TODO: error handling!
                .catch((error: any) => console.error(error));
            });
          })
          .catch();
      }
    });
  }

  public encrypt(data: string): string {
    const iv = CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(8));
    const cyphertext_raw = CryptoJS.AES.encrypt(data, this.key, { iv: iv, mode: CryptoJS.mode.CBC });
    const hmac = CryptoJS.HmacSHA256(cyphertext_raw.toString(), this.key.toString(CryptoJS.enc.Base64));

    return btoa(
      atob(iv.toString(CryptoJS.enc.Base64))
      + hmac.toString(CryptoJS.enc.Hex)
      + atob(cyphertext_raw.toString()
      ));
  }

}
