import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import moment from 'moment';
import { forkJoin, Observable, Observer } from 'rxjs';

import { createCacheKey } from '../../common/caching';
import { forecastWmsURL, rioifdmWmsURL } from '../../common/services';
import { UserLocation } from '../../Interfaces';
import { BelAqiIndexResult } from '../bel-aqi.service';
import { ForecastDateService } from '../forecast-date.service';
import { ValueProvider } from './value-provider';

const enum BelaqiIndexForecastLayer {
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
    private forecastDateSrvc: ForecastDateService
  ) {
    super(http);
  }

  public getIndexScores(location: UserLocation): Observable<BelAqiIndexResult[]> {
    const indices: BelAqiIndexResult[] = [];

    const requests = [
      this.createPast(location, moment().subtract(3, 'day')),
      this.createPast(location, moment().subtract(2, 'day')),
      this.createPast(location, moment().subtract(1, 'day')),
      this.createForecast(location, BelaqiIndexForecastLayer.TODAY, moment()),
      this.createForecast(location, BelaqiIndexForecastLayer.TOMORROW, moment().add(1, 'day')),
      this.createForecast(location, BelaqiIndexForecastLayer.TWO_DAYS, moment().add(2, 'day')),
      this.createForecast(location, BelaqiIndexForecastLayer.THREE_DAYS, moment().add(3, 'day'))
    ];
    return forkJoin(requests);
  }

  private createPast(location: UserLocation, day: moment.Moment): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      const url = rioifdmWmsURL;
      const params = {
        request: 'GetFeatureInfo',
        bbox: this.calculateRequestBbox(location.latitude, location.longitude),
        service: 'WMS',
        info_format: 'application/json',
        query_layers: 'rioifdm:belaqi_dmean',
        layers: 'rioifdm:belaqi_dmean',
        width: '1',
        height: '1',
        srs: 'EPSG:4326',
        version: '1.1.1',
        X: '1',
        Y: '1'
      };
      params['time'] = day.format('YYYY-MM-DD');
      const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, {
        responseType: 'json',
        params: params
      });
      this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), day.format('YYYY-MM-DD')), request)
        .subscribe(
          res => {
            const idx = this.getValueOfResponse(res);
            if (idx) {
              observer.next({
                indexScore: Math.round(idx),
                date: day,
                location: location
              });
            }
            observer.complete();
          },
          error => {
            console.error(error);
            console.error(`Couldn't get belaqi index for '${day.fromNow()}'`);
            observer.next(null);
            observer.complete();
          });
    });
  }

  private createForecast(location: UserLocation, layer: BelaqiIndexForecastLayer, day: moment.Moment): Observable<BelAqiIndexResult> {
    return new Observable<BelAqiIndexResult>((observer: Observer<BelAqiIndexResult>) => {
      this.forecastDateSrvc.getForecastDate().subscribe(
        date => {
          const url = forecastWmsURL;
          const params = {
            request: 'GetFeatureInfo',
            bbox: this.calculateRequestBbox(location.latitude, location.longitude),
            service: 'WMS',
            info_format: 'application/json',
            query_layers: layer.toString(),
            layers: layer.toString(),
            width: '1',
            height: '1',
            srs: 'EPSG:4326',
            version: '1.1.1',
            X: '1',
            Y: '1'
          };
          params['time'] = date.toISOString();
          const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, {
            responseType: 'json',
            params: params
          });
          this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), date.toISOString()), request)
            .subscribe(
              res => {
                const idx = this.getValueOfResponse(res);
                if (idx) {
                  observer.next({
                    indexScore: Math.round(idx),
                    date: day,
                    location: location
                  });
                }
                observer.complete();
              },
              error => {
                console.error(error);
                console.error(`Couldn't get belaqi index for '${day.fromNow()}'`);
                observer.next(null);
                observer.complete();
              });
        }
      );
    });
  }

}
