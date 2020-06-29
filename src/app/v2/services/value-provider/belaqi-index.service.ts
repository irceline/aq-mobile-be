import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import moment from 'moment';
import { forkJoin, Observable, Observer } from 'rxjs';

import { createCacheKey } from '../../common/caching';
import { forecastWmsURL, rioifdmBelaqiWmsURL, rioifdmWmsURL } from '../../common/services';
import { UserLocation } from '../../Interfaces';
import { BelAqiIndexResult } from '../bel-aqi.service';
import { ForecastDateService } from '../forecast-date.service';
import { IrcelineSettingsService } from '../irceline-settings/irceline-settings.service';
import { ValueProvider } from './value-provider';

enum BelaqiIndexForecastLayer {
  TODAY = 'forecast:belaqi_d0',
  TOMORROW = 'forecast:belaqi_d1',
  TWO_DAYS = 'forecast:belaqi_d2',
  THREE_DAYS = 'forecast:belaqi_d3',
}

@Injectable({
  providedIn: 'root'
})
export class BelaqiIndexService extends ValueProvider {

  constructor(
    protected http: HttpClient,
    private cacheService: CacheService,
    private forecastDateSrvc: ForecastDateService,
    private ircelineSettings: IrcelineSettingsService
  ) {
    super(http);
  }

  public getIndexScores(location: UserLocation): Observable<BelAqiIndexResult[]> {
    return forkJoin([
      this.createPast(location, moment().subtract(3, 'day')),
      this.createPast(location, moment().subtract(2, 'day')),
      this.createPast(location, moment().subtract(1, 'day')),
      this.createCurrent(location),
      this.createForecast(location, BelaqiIndexForecastLayer.TODAY, moment()),
      this.createForecast(location, BelaqiIndexForecastLayer.TOMORROW, moment().add(1, 'day')),
      this.createForecast(location, BelaqiIndexForecastLayer.TWO_DAYS, moment().add(2, 'day')),
      this.createForecast(location, BelaqiIndexForecastLayer.THREE_DAYS, moment().add(3, 'day'))
    ]);
  }

  private createPast(location: UserLocation, day: moment.Moment): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      const params = this.createFeatureInfoRequestParams('rioifdm:belaqi_dmean', location, day.format('YYYY-MM-DD'));
      const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(
        rioifdmWmsURL, { responseType: 'json', params: params });
      this.cacheService.loadFromObservable(createCacheKey(rioifdmWmsURL, JSON.stringify(params), day.format('YYYY-MM-DD')), request)
        .subscribe(
          res => this.handleResponse(res, observer, day, location),
          error => this.handleError(error, observer)
        );
    });
  }

  private createCurrent(location: UserLocation): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      this.ircelineSettings.getSettings().subscribe(
        settings => {
          const params = this.createFeatureInfoRequestParams('rioifdm:belaqi', location, settings.lastupdate.toISOString());
          const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(
            rioifdmBelaqiWmsURL, { responseType: 'json', params: params });
          this.cacheService.loadFromObservable(createCacheKey(rioifdmBelaqiWmsURL,
            JSON.stringify(params),
            settings.lastupdate.toISOString()
          ), request).subscribe(
            res => this.handleResponse(res, observer, moment(settings.lastupdate.toISOString()), location),
            error => this.handleError(error, observer)
          );
        });
    });
  }

  private createForecast(location: UserLocation, layer: BelaqiIndexForecastLayer, day: moment.Moment): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      this.forecastDateSrvc.getForecastDate().subscribe(
        date => {
          const url = forecastWmsURL;
          const params = this.createFeatureInfoRequestParams(layer.toString(), location, date.toISOString());
          const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, { responseType: 'json', params: params });
          this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), date.toISOString()), request)
            .subscribe(
              res => this.handleResponse(res, observer, day, location),
              error => this.handleError(error, observer)
            );
        }
      );
    });
  }

  private handleResponse(res: any, observer: Observer<BelAqiIndexResult>, date: moment.Moment, location: UserLocation) {
    const idx = this.getValueOfResponse(res);
    if (idx) {
      observer.next({
        indexScore: Math.round(idx),
        date,
        location: location
      });
    } else {
      observer.next(null);
    }
    observer.complete();
  }

  private handleError(error: any, observer: Observer<BelAqiIndexResult>) {
    console.error(error);
    observer.next(null);
    observer.complete();
  }

}
