import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { CacheService } from 'ionic-cache';
import { Network } from '@ionic-native/network/ngx';

const FORECAST_TIMESTRING_URL = 'https://www.irceline.be/air/timestring_forecast.php';
const DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK = 600000; // every 10 minutes

@Injectable({
  providedIn: 'root'
})
export class ForecastDateService {

  private lastRequest = -Infinity;
  private lastValue: Date;

  constructor(
    private http: HttpClient,
    private cache: CacheService,
    private network: Network
  ) { }

  private $forecastDate = this.http.get(FORECAST_TIMESTRING_URL, { responseType: 'text' }).pipe(
    share(),
    map(res => {
      const framechar = '\'';
      const first = res.indexOf(framechar) + 1;
      return new Date(res.substring(first, res.indexOf(framechar, first)));
    }),
    tap(
      res => {
        this.lastRequest = new Date().getTime();
        this.lastValue = res;
        this.cache.saveItem(FORECAST_TIMESTRING_URL, res);
      }
    )
  );

  public get forecastDate(): Observable<Date> {
    const current = new Date().getTime();
    if ((current - this.lastRequest) > DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK || !this.lastValue) {
      // lastRequest ist older than 10minutes OR we have not yet fetched the lastValue
      // Use cached value if device is offline
      if (this.network.type === 'none') {
        return from(this.cache.getItem<Date>(FORECAST_TIMESTRING_URL).then(v => new Date(v)).catch(v => new Date(0)));
      } else {
        return this.$forecastDate;
      }
    } else {
      // Get lastValue directly as it is newer than 10minutes
      return of(this.lastValue);
    }
  }
}
