import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import moment from 'moment';
import { forkJoin, Observable, Observer } from 'rxjs';

import { createCacheKey } from '../../common/caching';
import { ValueDate } from '../../common/enums';
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
      this.createPast(location, ValueDate.BEFORE_THREE_DAYS),
      this.createPast(location, ValueDate.BEFORE_TWO_DAYS),
      this.createPast(location, ValueDate.YESTERDAY),
      this.createCurrent(location),
      this.createForecast(location, BelaqiIndexForecastLayer.TODAY, ValueDate.TODAY),
      this.createForecast(location, BelaqiIndexForecastLayer.TOMORROW, ValueDate.TOMORROW),
      this.createForecast(location, BelaqiIndexForecastLayer.TWO_DAYS, ValueDate.IN_TWO_DAYS),
      this.createForecast(location, BelaqiIndexForecastLayer.THREE_DAYS, ValueDate.IN_THREE_DAYS)
    ]);
  }

  public getTodaysIndex(location: UserLocation): Observable<BelAqiIndexResult> {
    return this.createForecast(location, BelaqiIndexForecastLayer.TODAY, ValueDate.TODAY);
  }

  private createPast(location: UserLocation, valueDate: ValueDate): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      const day = this.createMoment(valueDate);
      const params = this.createFeatureInfoRequestParams('rioifdm:belaqi_dmean', location, day.format('YYYY-MM-DD'));
      const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(
        rioifdmWmsURL, { responseType: 'json', params: params });
      this.cacheService.loadFromObservable(createCacheKey(rioifdmWmsURL, JSON.stringify(params), day.format('YYYY-MM-DD')), request)
        .subscribe(
          res => this.handleResponse(res, observer, valueDate, location),
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
            res => this.handleResponse(res, observer, ValueDate.CURRENT, location),
            error => this.handleError(error, observer)
          );
        });
    });
  }

  private createForecast(
    location: UserLocation,
    layer: BelaqiIndexForecastLayer,
    valueDate: ValueDate
  ): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      this.forecastDateSrvc.getForecastDate().subscribe(
        date => {
          const url = forecastWmsURL;
          const params = this.createFeatureInfoRequestParams(layer.toString(), location, date.toISOString());
          const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, { responseType: 'json', params: params });
          this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), date.toISOString()), request)
            .subscribe(
              res => this.handleResponse(res, observer, valueDate, location),
              error => this.handleError(error, observer)
            );
        }
      );
    });
  }

  private handleResponse(
    res: any,
    observer: Observer<BelAqiIndexResult>,
    valueDate: ValueDate,
    location: UserLocation
  ) {
    let idx = this.getValueOfResponse(res);
    if (idx && !isNaN(idx)) {
      idx = Math.round(idx);
      if (idx >= 1 && idx <= 10) {
        observer.next({
          indexScore: Math.round(idx),
          valueDate,
          location: location
        });
        observer.complete();
      }
    }
    observer.next(null);
    observer.complete();
  }

  private createMoment(valueDate: ValueDate): moment.Moment {
    switch (valueDate) {
      case ValueDate.BEFORE_THREE_DAYS: return moment().subtract(3, 'day');
      case ValueDate.BEFORE_TWO_DAYS: return moment().subtract(2, 'day');
      case ValueDate.YESTERDAY: return moment().subtract(1, 'day');
      case ValueDate.TODAY: return moment();
      case ValueDate.TOMORROW: return moment().add(1, 'day');
      case ValueDate.IN_TWO_DAYS: return moment().add(2, 'day');
      case ValueDate.IN_THREE_DAYS: return moment().add(3, 'day');
    }
  }

  private handleError(error: any, observer: Observer<BelAqiIndexResult>) {
    console.error(error);
    observer.next(null);
    observer.complete();
  }

}
