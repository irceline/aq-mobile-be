import { Injectable, inject } from '@angular/core';
import { HttpService } from '@helgoland/core'; // i dont know why but its not working
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EncryptionService } from './../encryption/encryption.service';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';

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
  situation?: string;
  date_start?: string;
  date_end?: string;
  others_cause?: string;
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

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private key!: string;


  constructor(
    private storage: StorageService,
    // private httpSrvc: HttpService, // error
    private httpSrvc: HttpClient,
    private encryption: EncryptionService
  ) {
    this.storage.get<string>(FEEDBACK_KEY)
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
    console.log('feedback', feedback)
    feedback.uuid = this.key;
    const encriptedFeedback = this.encryption.encrypt(JSON.stringify(feedback));
    console.log(feedback);
    console.log(encriptedFeedback);
    // old code use helgoland
    // return this.httpSrvc.client().post<FeedbackStats>(FEEDBACK_SERVICE_URL, encriptedFeedback, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //   }
    // });
    return this.httpSrvc.post<FeedbackStats>(environment.FEEDBACK_SERVICE_URL, encriptedFeedback, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }

  public getFeedbackStats(): Observable<FeedbackStats> {
    // old code use helgoland
    // return this.httpSrvc.client({ expirationAtMs: 1000 * 60 * 60 }).get<FeedbackStats>(FEEDBACK_SERVICE_URL);
    return this.httpSrvc.get<FeedbackStats>(environment.FEEDBACK_SERVICE_URL);
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
