import { HttpClient } from '@angular/common/http';
import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import moment from 'moment';
import { forkJoin, Observable, Observer, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { createCacheKey } from '../../common/caching';
import { ValueDate } from '../../common/enums';
import { MainPhenomenon } from '../../common/phenomenon';
import { forecastWmsURL, rioifdmWmsURL } from '../../common/services';
import { UserLocation } from '../../Interfaces';
import { IrcelineSettingsService } from '../irceline-settings/irceline-settings.service';
import { ValueProvider } from './value-provider';

export interface ModelledValue {
  value: number;
  index: number;
  date: moment.Moment;
  valueDate: ValueDate;
}

enum CurrentModelledPhenomenonLayer {
  no2 = 'rioifdm:no2_hmean',
  o3 = 'rioifdm:o3_hmean',
  pm10 = 'rioifdm:pm10_24hmean',
  pm25 = 'rioifdm:pm25_24hmean',
  bc = 'rioifdm:bc_hmean'
}

const No2ForcastLayerMapping = [
  { date: ValueDate.TODAY, layerId: 'forecast:no2_maxhmean_d0' },
  { date: ValueDate.TOMORROW, layerId: 'forecast:no2_maxhmean_d1' },
  { date: ValueDate.IN_TWO_DAYS, layerId: 'forecast:no2_maxhmean_d2' },
  { date: ValueDate.IN_THREE_DAYS, layerId: 'forecast:no2_maxhmean_d3' }
];

const O3ForcastLayerMapping = [
  { date: ValueDate.TODAY, layerId: 'forecast:o3_maxhmean_d0' },
  { date: ValueDate.TOMORROW, layerId: 'forecast:o3_maxhmean_d1' },
  { date: ValueDate.IN_TWO_DAYS, layerId: 'forecast:o3_maxhmean_d2' },
  { date: ValueDate.IN_THREE_DAYS, layerId: 'forecast:o3_maxhmean_d3' }
];

const PM10ForcastLayerMapping = [
  { date: ValueDate.TODAY, layerId: 'forecast:pm10_dmean_d0' },
  { date: ValueDate.TOMORROW, layerId: 'forecast:pm10_dmean_d1' },
  { date: ValueDate.IN_TWO_DAYS, layerId: 'forecast:pm10_dmean_d2' },
  { date: ValueDate.IN_THREE_DAYS, layerId: 'forecast:pm10_dmean_d3' }
];

const PM25ForcastLayerMapping = [
  { date: ValueDate.TODAY, layerId: 'forecast:pm25_dmean_d0' },
  { date: ValueDate.TOMORROW, layerId: 'forecast:pm25_dmean_d1' },
  { date: ValueDate.IN_TWO_DAYS, layerId: 'forecast:pm25_dmean_d2' },
  { date: ValueDate.IN_THREE_DAYS, layerId: 'forecast:pm25_dmean_d3' }
];

enum PastModelledPhenomenonLayer {
  no2 = 'no2_maxhmean',
  o3 = 'o3_maxhmean',
  pm10 = 'pm10_24hmean',
  pm25 = 'pm25_24hmean'
}

@Injectable({
  providedIn: 'root'
})
export class ModelledValueService extends ValueProvider {

  constructor(
    protected http: HttpClient,
    private cacheService: CacheService,
    private ircelineSettings: IrcelineSettingsService
  ) {
    super(http);
  }

  public getValueTimeline(userLocation: UserLocation, phenomenon: MainPhenomenon): Observable<ModelledValue[]> {
    return forkJoin([
      this.getPastValue(userLocation, phenomenon, ValueDate.BEFORE_THREE_DAYS),
      this.getPastValue(userLocation, phenomenon, ValueDate.BEFORE_TWO_DAYS),
      this.getPastValue(userLocation, phenomenon, ValueDate.YESTERDAY),
      this.getCurrentValue(userLocation, phenomenon),
      this.getForecastValue(userLocation, phenomenon, ValueDate.TODAY),
      this.getForecastValue(userLocation, phenomenon, ValueDate.TOMORROW),
      this.getForecastValue(userLocation, phenomenon, ValueDate.IN_TWO_DAYS),
      this.getForecastValue(userLocation, phenomenon, ValueDate.IN_THREE_DAYS)
    ]);
  }

  public getCurrentValue(userLocation: UserLocation, phenomenon: MainPhenomenon): Observable<ModelledValue> {
    return new Observable<ModelledValue>((observer: Observer<ModelledValue>) => {
      this.getTimeParam(phenomenon, ValueDate.CURRENT).subscribe(timeparam => {
        const layerId = this.getLayersId(phenomenon, ValueDate.CURRENT);
        const url = this.getWmsUrl(phenomenon, ValueDate.CURRENT);
        const params = this.createFeatureInfoRequestParams(layerId, userLocation, timeparam);
        const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, { params });
        this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), timeparam), request)
          .subscribe(
            res => {
              const value = this.getValueOfResponse(res);
              if (isDefined(value)) {
                observer.next({
                  value,
                  index: this.categorize(value, phenomenon),
                  date: moment(timeparam),
                  valueDate: ValueDate.CURRENT
                });
              } else {
                throw new Error('No value returned');
              }
              observer.complete();
            },
            error => {
              console.error(error);
              observer.next(null);
              observer.complete();
            }
          );
      });
    });
  }

  public getWmsUrl(phenomenon: MainPhenomenon, valueDate: ValueDate): string {
    switch (valueDate) {
      case ValueDate.BEFORE_THREE_DAYS:
      case ValueDate.BEFORE_TWO_DAYS:
      case ValueDate.YESTERDAY:
        return rioifdmWmsURL;
      case ValueDate.CURRENT:
        return rioifdmWmsURL;
      case ValueDate.TODAY:
      case ValueDate.TOMORROW:
      case ValueDate.IN_TWO_DAYS:
      case ValueDate.IN_THREE_DAYS:
        return forecastWmsURL;
    }
  }

  public getTimeParam(phenomenon: MainPhenomenon, valueDate: ValueDate): Observable<string> {
    switch (valueDate) {
      case ValueDate.BEFORE_THREE_DAYS:
      case ValueDate.BEFORE_TWO_DAYS:
      case ValueDate.YESTERDAY:
        return this.createPastTimeStamp(valueDate);
      case ValueDate.CURRENT:
        return this.ircelineSettings.getSettings().pipe(map(e => e.lastupdate.toISOString()));
      case ValueDate.TODAY:
      case ValueDate.TOMORROW:
      case ValueDate.IN_TWO_DAYS:
      case ValueDate.IN_THREE_DAYS:
        return of(null);
    }
  }

  public getLayersId(phenomenon: MainPhenomenon, valueDate: ValueDate): string {
    switch (valueDate) {
      case ValueDate.BEFORE_THREE_DAYS:
      case ValueDate.BEFORE_TWO_DAYS:
      case ValueDate.YESTERDAY:
        return this.createPastLayerId(phenomenon);
      case ValueDate.CURRENT:
        return this.createCurrentLayerId(phenomenon);
      case ValueDate.TODAY:
      case ValueDate.TOMORROW:
      case ValueDate.IN_TWO_DAYS:
      case ValueDate.IN_THREE_DAYS:
        return this.createForecastLayerId(phenomenon, valueDate);
    }
  }

  private getForecastValue(userLocation: UserLocation, phenomenon: MainPhenomenon, date: ValueDate): Observable<ModelledValue> {
    return new Observable<ModelledValue>((observer: Observer<ModelledValue>) => {
      this.ircelineSettings.getSettings().subscribe(
        settings => {
          const url = this.getWmsUrl(phenomenon, date);
          const layerId = this.getLayersId(phenomenon, date);
          const params = this.createFeatureInfoRequestParams(layerId, userLocation);
          const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, {
            responseType: 'json',
            params: params
          });
          this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), settings.lastupdate), request)
            .subscribe(
              res => {
                const value = this.getValueOfResponse(res);
                if (isDefined(value) && value !== -9999) {
                  observer.next({
                    value,
                    index: this.categorize(value, phenomenon),
                    date: this.createDate(date),
                    valueDate: date
                  });
                  observer.complete();
                }
                observer.next(null);
                observer.complete();
              },
              error => {
                console.error(error);
                observer.next(null);
                observer.complete();
              }
            );
        }
      );
    });
  }

  private getPastValue(userLocation: UserLocation, phenomenon: MainPhenomenon, date: ValueDate): Observable<ModelledValue> {
    return new Observable<ModelledValue>((observer: Observer<ModelledValue>) => {
      this.createPastTimeStamp(date).subscribe(timeparam => {
        const url = this.getWmsUrl(phenomenon, date);
        const layerId = this.getLayersId(phenomenon, date);
        const params = this.createFeatureInfoRequestParams(layerId, userLocation, timeparam);
        const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, {
          responseType: 'json',
          params: params
        });
        this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), timeparam), request)
          .subscribe(
            res => {
              const value = this.getValueOfResponse(res);
              if (isDefined(value)) {
                observer.next({
                  value,
                  index: this.categorize(value, phenomenon),
                  date: this.createDate(date),
                  valueDate: date
                });
              } else {
                observer.next(null);
              }
              observer.complete();
            },
            error => {
              console.error(error);
              observer.next(null);
              observer.complete();
            }
          );
      });
    });
  }

  private createPastTimeStamp(date: ValueDate): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      this.ircelineSettings.getSettings().subscribe(
        settings => {
          switch (date) {
            case ValueDate.BEFORE_THREE_DAYS:
              observer.next(moment(settings.lastupdate_day).utc().startOf('days').subtract(2, 'days').toISOString());
              break;
            case ValueDate.BEFORE_TWO_DAYS:
              observer.next(moment(settings.lastupdate_day).utc().startOf('days').subtract(1, 'days').toISOString());
              break;
            case ValueDate.YESTERDAY:
              observer.next(moment(settings.lastupdate_day).utc().startOf('days').toISOString());
          }
          observer.complete();
        }
      );
    });
  }

  private createPastLayerId(phenomenon: MainPhenomenon): string {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return PastModelledPhenomenonLayer.no2;
      case MainPhenomenon.O3:
        return PastModelledPhenomenonLayer.o3;
      case MainPhenomenon.PM10:
        return PastModelledPhenomenonLayer.pm10;
      case MainPhenomenon.PM25:
        return PastModelledPhenomenonLayer.pm25;
    }
  }

  private createDate(date: ValueDate): moment.Moment {
    switch (date) {
      case ValueDate.BEFORE_THREE_DAYS:
        return moment().subtract(3, 'days');
      case ValueDate.BEFORE_TWO_DAYS:
        return moment().subtract(2, 'days');
      case ValueDate.YESTERDAY:
        return moment().subtract(1, 'days');
      case ValueDate.TODAY:
        return moment();
      case ValueDate.TOMORROW:
        return moment().add(1, 'days');
      case ValueDate.IN_TWO_DAYS:
        return moment().add(2, 'days');
      case ValueDate.IN_THREE_DAYS:
        return moment().add(3, 'days');
    }
  }

  private createForecastLayerId(phenomenon: MainPhenomenon, date: ValueDate): string {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return No2ForcastLayerMapping.find(e => e.date === date).layerId;
      case MainPhenomenon.O3:
        return O3ForcastLayerMapping.find(e => e.date === date).layerId;
      case MainPhenomenon.PM10:
        return PM10ForcastLayerMapping.find(e => e.date === date).layerId;
      case MainPhenomenon.PM25:
        return PM25ForcastLayerMapping.find(e => e.date === date).layerId;
    }
  }

  private createCurrentLayerId(phenomenon: MainPhenomenon) {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return CurrentModelledPhenomenonLayer.no2.toString();
      case MainPhenomenon.O3:
        return CurrentModelledPhenomenonLayer.o3.toString();
      case MainPhenomenon.PM10:
        return CurrentModelledPhenomenonLayer.pm10.toString();
      case MainPhenomenon.PM25:
        return CurrentModelledPhenomenonLayer.pm25.toString();
      case MainPhenomenon.BC:
        return CurrentModelledPhenomenonLayer.bc.toString();
    }
  }

  private categorize(value: number, phenomenon: MainPhenomenon): number {
    switch (phenomenon) {
      case MainPhenomenon.O3:
        return this.categorizeO3(value);
      case MainPhenomenon.PM10:
        return this.categorizePM10(value);
      case MainPhenomenon.PM25:
        return this.categorizePM25(value);
      case MainPhenomenon.NO2:
        return this.categorizeNO2(value);
      case MainPhenomenon.BC:
        return this.categorizeBC(value);
      default:
        throw new Error('not implemented for ' + phenomenon);
    }
  }

  private categorizeNO2(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 20) { return 1; }
    if (value <= 50) { return 2; }
    if (value <= 70) { return 3; }
    if (value <= 120) { return 4; }
    if (value <= 150) { return 5; }
    if (value <= 180) { return 6; }
    if (value <= 200) { return 7; }
    if (value <= 250) { return 8; }
    if (value <= 300) { return 9; }
    return 10;
  }

  private categorizeO3(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 25) { return 1; }
    if (value <= 50) { return 2; }
    if (value <= 70) { return 3; }
    if (value <= 120) { return 4; }
    if (value <= 160) { return 5; }
    if (value <= 180) { return 6; }
    if (value <= 240) { return 7; }
    if (value <= 280) { return 8; }
    if (value <= 320) { return 9; }
    return 10;
  }

  private categorizePM10(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 10) { return 1; }
    if (value <= 20) { return 2; }
    if (value <= 30) { return 3; }
    if (value <= 40) { return 4; }
    if (value <= 50) { return 5; }
    if (value <= 60) { return 6; }
    if (value <= 70) { return 7; }
    if (value <= 80) { return 8; }
    if (value <= 100) { return 9; }
    return 10;
  }

  private categorizePM25(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 5) { return 1; }
    if (value <= 10) { return 2; }
    if (value <= 15) { return 3; }
    if (value <= 25) { return 4; }
    if (value <= 35) { return 5; }
    if (value <= 40) { return 6; }
    if (value <= 50) { return 7; }
    if (value <= 60) { return 8; }
    if (value <= 70) { return 9; }
    return 10;
  }

  private categorizeBC(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 0.99) { return 1; }
    if (value <= 1.99) { return 2; }
    if (value <= 2.99) { return 3; }
    if (value <= 3.99) { return 4; }
    if (value <= 4.99) { return 5; }
    if (value <= 6.99) { return 6; }
    if (value <= 9.99) { return 7; }
    if (value <= 14.99) { return 8; }
    if (value <= 19.99) { return 9; }
    return 10;
  }

}
