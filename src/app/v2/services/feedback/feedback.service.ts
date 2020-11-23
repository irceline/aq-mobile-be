import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EncryptionService } from './../encryption/encryption.service';

export interface FeedbackStats {
  submissions_day: string;
  submissions_total: string;
  inline_day: string;
  inline_total: string;
  woodburn_day: string;
  woodburn_total: string;
  traffic_day: string;
  traffic_total: string;
  agriculture_day: string;
  agriculture_total: string;
  industry_day: string;
  industry_total: string;
}

export interface Feedback {
  uuid?: string;
  lat: number;
  lng: number;
  feedback_code: FeedbackCode;
}

export enum FeedbackCode {
  INLINE = 0,
  NOT_INLINE_WITHOUT_INFO = 1,
  WOODBURN = 2,
  TRAFFIC = 3,
  AGRICULTURE = 4,
  INDUSTRY = 5
}

const FEEDBACK_KEY = 'feedback_key';
const FEEDBACK_SERVICE_URL = 'https://www.irceline.be/air/belair_feedback.php';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private key: string;

  constructor(
    private storage: Storage,
    private httpSrvc: HttpService,
    private encryption: EncryptionService
  ) {
    this.storage.get(FEEDBACK_KEY)
      .then(key => {
        if (key) {
          this.key = key;
        } else {
          this.createKey();
        }
      })
      .catch(() => this.createKey());
  }

  public sendFeedback(feedback: Feedback): Observable<FeedbackStats> {
    feedback.uuid = this.key;
    const encriptedFeedback = this.encryption.encrypt(JSON.stringify(feedback));
    console.log(feedback);
    console.log(encriptedFeedback);
    return this.httpSrvc.client().post<FeedbackStats>(FEEDBACK_SERVICE_URL, encriptedFeedback, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }

  public getFeedbackStats(): Observable<FeedbackStats> {
    return this.httpSrvc.client({ expirationAtMs: 1000 * 60 * 60 }).get<FeedbackStats>(FEEDBACK_SERVICE_URL);
  }

  private createKey() {
    this.key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    this.storage.set(FEEDBACK_KEY, this.key);
  }

}
