import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const FORECAST_TIMESTRING_URL = 'https://www.irceline.be/air/timestring_forecast.php';
const DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK = 600; // every 10 minutes

@Injectable({
  providedIn: 'root'
})
export class ForecastDateService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  public getForecastDate(): Observable<Date> {
    const request = this.http.get(FORECAST_TIMESTRING_URL, { responseType: 'text' });
    return this.cacheService.loadFromObservable(FORECAST_TIMESTRING_URL, request, null, DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK)
      .pipe(map(res => {
        const framechar = '\'';
        const first = res.indexOf(framechar) + 1;
        return new Date(res.substring(first, res.indexOf(framechar, first)));
      }));
  }

}
