import '../../components/map-component/custom-canvas';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import * as L from 'leaflet';
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

enum BelaqiIndexPreviousLayer {
  YESTERDAY = 'rioifdm:belaqi_dm1',
  BEFORE_TWO_DAYS = 'rioifdm:belaqi_dm2',
  BEFORE_THREE_DAYS = 'rioifdm:belaqi_dm3',
}
const BelaqiCurrentLayerId = 'rioifdm:belaqi';
//const BelaqiPastLayerId = 'rioifdm:belaqi_dmean';

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
    // super(http);
    super();
  }

  public getIndexScores(location: UserLocation): Observable<BelAqiIndexResult[]> {
    return forkJoin([
      this.createPast(location, ValueDate.BEFORE_THREE_DAYS),
      this.createPast(location, ValueDate.BEFORE_TWO_DAYS),
      this.createPast(location, ValueDate.YESTERDAY),
      this.createCurrent(location),
      this.createForecast(location, ValueDate.TODAY),
      this.createForecast(location, ValueDate.TOMORROW),
      this.createForecast(location, ValueDate.IN_TWO_DAYS),
      this.createForecast(location, ValueDate.IN_THREE_DAYS)
    ]);
  }

  public getCurrentIndex(location: UserLocation): Observable<BelAqiIndexResult> {
    return this.createCurrent(location);
  }
  public getTodaysIndex(location: UserLocation): Observable<BelAqiIndexResult> {
    return this.createForecast(location, ValueDate.TODAY);
  }

  public getWmsUrl(valueDate: ValueDate): string {
    switch (valueDate) {
      case ValueDate.BEFORE_THREE_DAYS:
      case ValueDate.BEFORE_TWO_DAYS:
      case ValueDate.YESTERDAY:
        return rioifdmWmsURL;
      case ValueDate.CURRENT:
        return rioifdmBelaqiWmsURL;
      case ValueDate.TODAY:
      case ValueDate.TOMORROW:
      case ValueDate.IN_TWO_DAYS:
      case ValueDate.IN_THREE_DAYS:
        return forecastWmsURL;
    }
  }

  public getLayersId(valueDate: ValueDate): string {
    switch (valueDate) {
      case ValueDate.BEFORE_THREE_DAYS:
        return BelaqiIndexPreviousLayer.BEFORE_THREE_DAYS.toString();
      case ValueDate.BEFORE_TWO_DAYS:
        return BelaqiIndexPreviousLayer.BEFORE_TWO_DAYS.toString();
      case ValueDate.YESTERDAY:
        return BelaqiIndexPreviousLayer.YESTERDAY.toString();
      case ValueDate.CURRENT:
        return BelaqiCurrentLayerId;
      case ValueDate.TODAY:
        return BelaqiIndexForecastLayer.TODAY.toString();
      case ValueDate.TOMORROW:
        return BelaqiIndexForecastLayer.TOMORROW.toString();
      case ValueDate.IN_TWO_DAYS:
        return BelaqiIndexForecastLayer.TWO_DAYS.toString();
      case ValueDate.IN_THREE_DAYS:
        return BelaqiIndexForecastLayer.THREE_DAYS.toString();
    }
  }

  public getLayerOptions(valueDate: ValueDate): L.CustomCanvasOptions {
    const options: L.CustomCanvasOptions = {
      layers: this.getLayersId(valueDate),
      transparent: true,
      format: 'image/png',
    };

    return options;
  }

  private createPast(location: UserLocation, valueDate: ValueDate): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      const day = this.createMoment(valueDate);
      const params = this.createFeatureInfoRequestParams(this.getLayersId(valueDate), location);
      const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(
        rioifdmWmsURL, { responseType: 'json', params: params });
        const cacheKey = createCacheKey(rioifdmWmsURL, JSON.stringify(params));
        let ttl = 60 * 60 * 1 // 1 hour
        this.cacheService.loadFromObservable(cacheKey, request, '', ttl)
        .subscribe(
          res => this.handleResponse(res, observer, valueDate, location, cacheKey),
          error => this.handleError(error, observer)
        );
    });
  }

  private createCurrent(location: UserLocation): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      this.ircelineSettings.getSettings().subscribe(
        settings => {
          const params = this.createFeatureInfoRequestParams(this.getLayersId(ValueDate.CURRENT),
            location, settings.lastupdate.toISOString());
          const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(
            rioifdmBelaqiWmsURL, { responseType: 'json', params: params });
            const cacheKey = createCacheKey(rioifdmBelaqiWmsURL, JSON.stringify(params), settings.lastupdate.toISOString());
            let ttl = 60 * 5; //5 minutes
            this.cacheService.loadFromObservable(cacheKey, request, '', ttl).subscribe(
            res => this.handleResponse(res, observer, ValueDate.CURRENT, location, cacheKey),
            error => this.handleError(error, observer)
          );
        },
        error => this.handleError(error, observer)
      );
    });
  }

  private createForecast(
    location: UserLocation,
    valueDate: ValueDate
  ): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      this.forecastDateSrvc.forecastDate.subscribe(
        date => {
          if (date) {
            const url = forecastWmsURL;
            const params = this.createFeatureInfoRequestParams(this.getLayersId(valueDate), location);
            const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, { responseType: 'json', params: params });
            const cacheKey = createCacheKey(url, JSON.stringify(params));
            let ttl = 60 * 60 * 1; //1 hour
            this.cacheService.loadFromObservable(cacheKey, request, '', ttl)
              .subscribe(
                res => this.handleResponse(res, observer, valueDate, location, cacheKey),
                error => this.handleError(error, observer)
              );
          }
        },
        error => {
          return this.handleError(error, observer);
        }
      );
    });
  }

  private handleResponse(
    res: any,
    observer: Observer<BelAqiIndexResult>,
    valueDate: ValueDate,
    location: UserLocation,
    cacheKey: string
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
        return;
      }
    }
    // @ts-ignore
    observer.next(null);
    observer.complete();
    setTimeout(() => {
      this.cacheService.removeItem(cacheKey);
    }, 100);
  }


  // @ts-ignore
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
    // @ts-ignore
    observer.next(null);
    observer.complete();
  }

}
