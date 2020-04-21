import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { CacheService } from 'ionic-cache';
import moment from 'moment';
import { Observable, Observer, Subscriber, Subscription } from 'rxjs';

import { MobileSettings } from '../settings/settings.service';
import { Network } from '@ionic-native/network/ngx';

export interface IrcelineSettings {
  lastupdate: Date;
  timestring: string;
  timestring_day: string;
  top_pollutant_today: string;
  survey?: boolean;
}

const DEFAULT_TTL_CACHE = 60 * 60 * 24 * 3; // 3 days
const DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK = 60; // 1 minute

@Injectable()
export class IrcelineSettingsService implements OnInit, OnDestroy {

  private _isOnline: boolean;
  private networkSubscriptionOnline: Subscription;
  private networkSubscriptionOffline: Subscription;

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService<MobileSettings>,
    private cacheService: CacheService,
    private network: Network,
  ) {
  }

  public ngOnInit() {
    this.cacheService.setDefaultTTL(DEFAULT_TTL_CACHE);
    this.cacheService.clearExpired()
      .catch(error => console.log(error));
    this.networkSubscriptionOnline = this.network.onConnect().subscribe(() => {
      this._isOnline = true;
    })
    this.networkSubscriptionOffline = this.network.onDisconnect().subscribe(() => {
      this._isOnline = false;
    })
  }

  public ngOnDestroy() {
    this.networkSubscriptionOffline.unsubscribe();
    this.networkSubscriptionOnline.unsubscribe();
  }

  public getLastForecastUpdate(): Observable<Date> {
    const url = this.settingsService.getSettings().ircelineLastForecastUpdateUrl;
    return new Observable<Date>((observer: Observer<Date>) => {
        this.fetchLastForecastTime(url, observer);
    });
  }

  public getSettings(reload?: boolean): Observable<IrcelineSettings> {
      // Check if device is connected to network
      // Discard forced refresh if this is not the case to preserve cache
      if (!this._isOnline) {
        reload = false;
      }

    const url = this.settingsService.getSettings().ircelineSettingsUrl;
    return new Observable<IrcelineSettings>((observer: Observer<IrcelineSettings>) => {
      if (reload) {
        this.cacheService.removeItem(url)
          .then(() => {
            this.fetchSettings(url, observer);
          })
          .catch(() => this.fetchSettings(url, observer));
      } else {
        this.fetchSettings(url, observer);
      }
    });
  }

  private fetchSettings(url: string, observer: Observer<IrcelineSettings>) {
    const request = this.http.get(url);
    this.cacheService.loadFromObservable(url, request, null, DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK).subscribe(
      result => observer.next({
        lastupdate: moment(result['lastupdate']).toDate(),
        timestring: result['timestring'],
        timestring_day: result['timestring_day'],
        top_pollutant_today: result['top_pollutant_today'],
        survey: result.survey ? result.survey === '1' : false
      }),
      error => observer.error(error),
      () => observer.complete()
    );
  }

  private fetchLastForecastTime(url: string, observer: Observer<Date>) {
    const request = this.http.get(url);
    this.cacheService.loadFromObservable(url, request, null, DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK).subscribe(
      result => observer.next(moment(result['lastupdate_forecast']).toDate()),
      error => observer.error(error),
      () => observer.complete()
    );
  }

}
