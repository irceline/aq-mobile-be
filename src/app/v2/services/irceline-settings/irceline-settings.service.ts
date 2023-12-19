import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { CacheService } from 'ionic-cache';
import moment from 'moment';
import { Observable, Observer } from 'rxjs';

import { MobileSettings } from '../settings/settings.service';
import { ErrorModalService, ErrorType } from './../../components/error-modal/error-modal.service';

export interface IrcelineSettings {
  lastupdate: Date;
  timestring: string;
  timestring_day: string;
  lastupdate_day: string;
  lastupdate_year: number;
  top_pollutant_today: string;
  survey?: boolean;
}

const DEFAULT_TTL_CACHE = 60 * 60 * 24 * 3; // 3 days
const DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK = 60; // 1 minute

@Injectable({
  providedIn: 'root'
})
export class IrcelineSettingsService {

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService<MobileSettings>,
    private cacheService: CacheService,
    private errorSrvc: ErrorModalService
  ) {
    this.cacheService.setDefaultTTL(DEFAULT_TTL_CACHE);
    this.cacheService.clearExpired()
      .catch(error => console.log(error));
  }

  public getSettings(reload?: boolean): Observable<IrcelineSettings> {
    const url = this.settingsService.getSettings().ircelineSettingsUrl;
    return new Observable<IrcelineSettings>((observer: Observer<IrcelineSettings>) => {
      if (reload) {
        this.cacheService.removeItem(url)
          .then(() => {
            this.doRequest(url, observer);
          })
          .catch(() => this.doRequest(url, observer));
      } else {
        this.doRequest(url, observer);
      }
    });
  }

  private doRequest(url: string, observer: Observer<IrcelineSettings>) {
    const request = this.http.get(url);
    // @ts-ignore
    this.cacheService.loadFromObservable(url, request, null, DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK).subscribe(
      result => {
        observer.next({
          lastupdate: moment(result['lastupdate']).toDate(),
          lastupdate_day: result.lastupdate_day,
          lastupdate_year: parseInt(result.lastupdate_year, 10),
          timestring: result['timestring'],
          timestring_day: result['timestring_day'],
          top_pollutant_today: result['top_pollutant_today'],
          survey: result.survey ? result.survey === '1' : false
        });
        observer.complete();
      },
      error => {
        this.errorSrvc.openErrorModal(ErrorType.NO_IRCELINE_SETTINGS);
        observer.error(error);
        observer.complete();
      },
    );
  }

}
