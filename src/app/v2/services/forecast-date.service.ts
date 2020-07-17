import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';

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
      }
    )
  );

  public get forecastDate(): Observable<Date> {
    const current = new Date().getTime();
    if ((current - this.lastRequest) > DEFAULT_TTL_CACHE_LAST_UPDATE_CHECK || !this.lastValue) {
      return this.$forecastDate;
    } else {
      return of(this.lastValue);
    }
  }

}
