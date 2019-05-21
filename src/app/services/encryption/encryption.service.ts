import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { Firebase } from '@ionic-native/firebase/ngx';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private key: CryptoJS.WordArray;

  constructor(private firebase: Firebase) {
    this.firebase.getValue('subscription_key')
    .then((res: any) => this.key = CryptoJS.enc.Base64.parse(res))
    //TODO: error handling!
    .catch((error: any) => console.error(error));
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
