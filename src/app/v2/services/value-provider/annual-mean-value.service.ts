import { HttpClient } from '@angular/common/http';
import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { createCacheKey } from '../../common/caching';
import { MainPhenomenon } from '../../common/phenomenon';
import { UserLocation } from '../../Interfaces';
import { IrcelineSettingsService } from './../irceline-settings/irceline-settings.service';
import { ValueProvider } from './value-provider';

const phenomenonMapping = [
  {
    phenomenon: MainPhenomenon.NO2,
    layerPrefix: 'no2_anmean_'
  },
  {
    phenomenon: MainPhenomenon.O3,
    layerPrefix: 'o3_anmean_'
  },
  {
    phenomenon: MainPhenomenon.PM10,
    layerPrefix: 'pm10_anmean_',
  },
  {
    phenomenon: MainPhenomenon.PM25,
    layerPrefix: 'pm25_anmean_'
  },
  {
    phenomenon: MainPhenomenon.BC,
    layerPrefix: 'bc_anmean_'
  },
  {
    phenomenon: MainPhenomenon.BELAQI,
    layerPrefix: 'belaqi_anmean_'
  },
  {
    phenomenon: MainPhenomenon.BELAQI_DAY, //anmean BelAQI based on the daily index scales. To used to indicate the "Average score at location"
    layerPrefix: 'belaqi_anmean_dayscale_'
  }
];

export interface AnnualMeanValue {
  value: number;
  year: number;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnnualMeanValueService extends ValueProvider {

  constructor(
    public http: HttpClient,
    private ircelineSettingsSrvc: IrcelineSettingsService,
    private cacheService: CacheService
  ) {
    super(http);
  }

  public getLastValue(userLocation: UserLocation, phenomenon: MainPhenomenon): Observable<AnnualMeanValue> {
    return this.getYear().pipe(mergeMap(year => this.getValueForYear(userLocation, phenomenon, year)));
  }

  public getAnnualValueList(userLocation: UserLocation, phenomenon: MainPhenomenon): Observable<AnnualMeanValue[]> {
    return this.getYear().pipe(mergeMap(year => {
      const req: Observable<AnnualMeanValue>[] = [];
      for (let index = 0; index < 5; index++) {
        req.push(this.getValueForYear(userLocation, phenomenon, year - index));
      }
      return forkJoin(req);
    }));
  }

  private getValueForYear(userLocation: UserLocation, phenomenon: MainPhenomenon, year: number): Observable<AnnualMeanValue> {
    const layerId = this.createLayerId(year, phenomenon);
    const url = this.createWmsUrl(layerId);
    const params = this.createFeatureInfoRequestParams(layerId, userLocation);
    const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, { responseType: 'json', params: params });
    let ttl = 3600 * 24; // one day
    return this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), `${year}`), request, '', ttl).pipe(
      catchError(_ => of({})),
      map(res => {
        const value = this.getValueOfResponse(res);
        if (isDefined(value)) {
          return {
            value,
            year: year,
            index: this.categorize(phenomenon, value)
          };
        } else {
          return null;
        }
      })
    );
  }

  private getYear(): Observable<number> {
    return this.ircelineSettingsSrvc.getSettings().pipe(map(res => res.lastupdate_year));
  }

  private createLayerId(year: number, phenomenon: MainPhenomenon): string {
    return `${phenomenonMapping.find(e => e.phenomenon === phenomenon).layerPrefix}${year}`;
  }

  private createWmsUrl(layerId: string): string {
    return `https://geobelair.irceline.be/annual/wms`;
  }


  private categorize(phenomenon: MainPhenomenon, value: number): number {
    switch (phenomenon) {
      case MainPhenomenon.NO2: return this.categorizeNO2(value);
      case MainPhenomenon.O3: return this.categorizeO3(value);
      case MainPhenomenon.PM10: return this.categorizePM10(value);
      case MainPhenomenon.PM25: return this.categorizePM25(value);
      //case MainPhenomenon.BC: return this.categorizeBC(value);
      case MainPhenomenon.BELAQI: return value;
      case MainPhenomenon.BELAQI_DAY: return value;
    }
  }

  private categorizeBC(value: number): number {
    if (value <= 0.505) { return 1; }
    if (value <= 1.005) { return 2; }
    if (value <= 1.255) { return 3; }
    if (value <= 1.505) { return 4; }
    if (value <= 1.755) { return 5; }
    if (value <= 2.005) { return 6; }
    if (value <= 2.505) { return 7; }
    if (value <= 3.005) { return 8; }
    if (value <= 3.505) { return 9; }
    return 10;
  }

  private categorizePM25(value: number): number {
    if (value <= 1.55) { return 1; }
    if (value <= 2.55) { return 2; }
    if (value <= 3.55) { return 3; }
    if (value <= 5.05) { return 4; }
    if (value <= 7.55) { return 5; }
    if (value <= 10.55) { return 6; }
    if (value <= 12.55) { return 7; }
    if (value <= 15.5) { return 8; }
    if (value <= 20.5) { return 9; }
    return 10;
  }

  private categorizePM10(value: number): number {
    if (value <= 3.5) { return 1; }
    if (value <= 7.5) { return 2; }
    if (value <= 10.5) { return 3; }
    if (value <= 15.5) { return 4; }
    if (value <= 20.5) { return 5; }
    if (value <= 25.5) { return 6; }
    if (value <= 30.5) { return 7; }
    if (value <= 35.5) { return 8; }
    if (value <= 40.5) { return 9; }
    return 10;
  }

  private categorizeO3(value: number): number {
    if (value <= 10.5) { return 1; }
    if (value <= 20.5) { return 2; }
    if (value <= 30.5) { return 3; }
    if (value <= 35.5) { return 4; }
    if (value <= 40.5) { return 5; }
    if (value <= 45.5) { return 6; }
    if (value <= 50.5) { return 7; }
    if (value <= 55.5) { return 8; }
    if (value <= 60.5) { return 9; }
    return 10;
  }

  private categorizeNO2(value: number): number {
    if (value <= 2.5) { return 1; }
    if (value <= 5.5) { return 2; }
    if (value <= 7.5) { return 3; }
    if (value <= 10.5) { return 4; }
    if (value <= 15.5) { return 5; }
    if (value <= 20.5) { return 6; }
    if (value <= 25.5) { return 7; }
    if (value <= 30.5) { return 8; }
    if (value <= 40.5) { return 9; }
    return 10;
  }

}
