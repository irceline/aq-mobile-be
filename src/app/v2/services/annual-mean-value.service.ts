import { HttpClient } from '@angular/common/http';
import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

import { createCacheKey } from '../../model/caching';
import { ValueProvider } from '../../services/value-provider';
import { UserLocation } from '../Interfaces';
import { MainPhenomenon } from './../../model/phenomenon';

const TTL_ANNUAL_YEAR_REQUEST = 60 * 60 * 24; // one day
const ANNUAL_MEAN_URL = 'https://www.irceline.be/air/timestring_rioifdm_anmean.php';

const phenomenonMapping = [
  {
    phenonenon: MainPhenomenon.NO2,
    layerPrefix: 'no2_anmean_'
  },
  {
    phenonenon: MainPhenomenon.O3,
    layerPrefix: 'o3_anmean_'
  },
  {
    phenonenon: MainPhenomenon.PM10,
    layerPrefix: 'pm10_anmean_',
  },
  {
    phenonenon: MainPhenomenon.PM25,
    layerPrefix: 'pm25_anmean_'
  },
  {
    phenonenon: MainPhenomenon.BC,
    layerPrefix: 'bc_anmean_'
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
    private cacheService: CacheService
  ) {
    super(http);
  }

  public getLastValue(userLocation: UserLocation, phenomenon: MainPhenomenon): Observable<AnnualMeanValue> {
    return new Observable<AnnualMeanValue>((observer: Observer<AnnualMeanValue>) => {
      this.getYear().subscribe(year => {
        const layerId = this.createLayerId(year, phenomenon);
        const url = this.createWmsUrl(layerId);
        const params = {
          request: 'GetFeatureInfo',
          bbox: this.calculateRequestBbox(userLocation.latitude, userLocation.longitude),
          service: 'WMS',
          info_format: 'application/json',
          query_layers: layerId,
          layers: layerId,
          width: '1',
          height: '1',
          srs: 'EPSG:4326',
          version: '1.1.1',
          X: '1',
          Y: '1'
        };

        const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url,
          {
            responseType: 'json',
            params: params
          }
        );
        return this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), `${year}`), request).subscribe(
          res => {
            const value = this.getValueOfResponse(res);
            if (isDefined(value)) {
              observer.next({
                value,
                year: year,
                index: this.categorize(phenomenon, value)
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

  private getYear(): Observable<number> {
    const request = this.http.get(ANNUAL_MEAN_URL, { responseType: 'text' });
    return this.cacheService.loadFromObservable(ANNUAL_MEAN_URL, request, null, TTL_ANNUAL_YEAR_REQUEST).pipe(
      map(res => {
        const framechar = '\'';
        const first = res.indexOf(framechar) + 1;
        return Number.parseInt(res.substring(first, res.indexOf(framechar, first)), 10);
      }));
  }

  private createLayerId(year: number, phenomenon: MainPhenomenon): string {
    return `${phenomenonMapping.find(e => e.phenonenon === phenomenon).layerPrefix}${year}_atmostreet`;
  }

  private createWmsUrl(layerId: string): string {
    return `https://geo.irceline.be/rioifdm/${layerId}/wms`;
  }


  private categorize(phenomenon: MainPhenomenon, value: number): number {
    switch (phenomenon) {
      case MainPhenomenon.NO2: return this.categorizeNO2(value);
      case MainPhenomenon.O3: return this.categorizeO3(value);
      case MainPhenomenon.PM10: return this.categorizePM10(value);
      case MainPhenomenon.PM25: return this.categorizePM25(value);
      case MainPhenomenon.BC: return this.categorizeBC(value);
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
    if (value <= 5.5) { return 1; }
    if (value <= 7.5) { return 2; }
    if (value <= 10.5) { return 3; }
    if (value <= 12.5) { return 4; }
    if (value <= 15.5) { return 5; }
    if (value <= 20.5) { return 6; }
    if (value <= 25.5) { return 7; }
    if (value <= 30.5) { return 8; }
    if (value <= 35.5) { return 9; }
    return 10;
  }

  private categorizePM10(value: number): number {
    if (value <= 10.5) { return 1; }
    if (value <= 15.5) { return 2; }
    if (value <= 20.5) { return 3; }
    if (value <= 25.5) { return 4; }
    if (value <= 30.5) { return 5; }
    if (value <= 35.5) { return 6; }
    if (value <= 40.5) { return 7; }
    if (value <= 45.5) { return 8; }
    if (value <= 50.5) { return 9; }
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
    if (value <= 10.5) { return 1; }
    if (value <= 15.5) { return 2; }
    if (value <= 20.5) { return 3; }
    if (value <= 25.5) { return 4; }
    if (value <= 30.5) { return 5; }
    if (value <= 35.5) { return 6; }
    if (value <= 40.5) { return 7; }
    if (value <= 45.5) { return 8; }
    if (value <= 50.5) { return 9; }
    return 10;
  }

}
