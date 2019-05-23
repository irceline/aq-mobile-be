import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createCacheKey } from '../../model/caching';
import { BelaqiIndexService } from '../belaqi/belaqi.service';
import { ValueProvider } from '../value-provider';

const ANNUAL_MEAN_URL = 'http://www.irceline.be/air/timestring_rioifdm_anmean.php';

export enum AnnualPhenomenonMapping {
  NO2 = 'no2_anmean_',
  O3 = 'o3_anmean_',
  PM10 = 'pm10_anmean_',
  PM25 = 'pm25_anmean_',
  BC = 'bc_anmean_'
}

const TTL_ANNUAL_YEAR_REQUEST = 60 * 60 * 24; // one day

@Injectable()
export class AnnualMeanService extends ValueProvider {

  constructor(
    public http: HttpClient,
    public belaqi: BelaqiIndexService,
    private cacheService: CacheService
  ) {
    super(http);
  }

  public getYear(): Observable<string> {
    const request = this.http.get(ANNUAL_MEAN_URL, { responseType: 'text' });
    return this.cacheService.loadFromObservable(ANNUAL_MEAN_URL, request, null, TTL_ANNUAL_YEAR_REQUEST).pipe(
      map(res => {
        const framechar = '\'';
        const first = res.indexOf(framechar) + 1;
        return res.substring(first, res.indexOf(framechar, first));
      }));
  }

  public getLayerId(year: string, phenomenon: AnnualPhenomenonMapping): string {
    return phenomenon.toString() + year + '_atmostreet';
  }

  public getWMSUrl(year: string, phenomenon: AnnualPhenomenonMapping): string {
    const layerId = this.getLayerId(year, phenomenon);
    return `http://geo.irceline.be/rioifdm/${layerId}/wms`;
  }

  public getValue(latitude: number, longitude: number, year: string, phenomenon: AnnualPhenomenonMapping): Observable<number> {
    const url = this.getWMSUrl(year, phenomenon);
    const layerId = this.getLayerId(year, phenomenon);
    const params = {
      request: 'GetFeatureInfo',
      bbox: this.calculateRequestBbox(latitude, longitude),
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

    return this.cacheService.loadFromObservable(createCacheKey(url, JSON.stringify(params), year), request).pipe(
      map((res) => {
        if (res && res.features && res.features.length === 1) {
          if (res.features[0].properties['GRAY_INDEX']) {
            return res.features[0].properties['GRAY_INDEX'];
          }
          return 0;
        } else {
          throw new Error('No value returned');
        }
      })
    );
  }

  public getCategorizeColor(phenomenon: AnnualPhenomenonMapping, value: number): string {
    switch (phenomenon) {
      case AnnualPhenomenonMapping.NO2: return this.categorizeNO2(value);
      case AnnualPhenomenonMapping.O3: return this.categorizeO3(value);
      case AnnualPhenomenonMapping.PM10: return this.categorizePM10(value);
      case AnnualPhenomenonMapping.PM25: return this.categorizePM25(value);
      case AnnualPhenomenonMapping.BC: return this.categorizeBC(value);
    }
  }

  private categorizeBC(value: number): string {
    if (value <= 0.505) { return this.belaqi.getColorForIndex(1); }
    if (value <= 1.005) { return this.belaqi.getColorForIndex(2); }
    if (value <= 1.255) { return this.belaqi.getColorForIndex(3); }
    if (value <= 1.505) { return this.belaqi.getColorForIndex(4); }
    if (value <= 1.755) { return this.belaqi.getColorForIndex(5); }
    if (value <= 2.005) { return this.belaqi.getColorForIndex(6); }
    if (value <= 2.505) { return this.belaqi.getColorForIndex(7); }
    if (value <= 3.005) { return this.belaqi.getColorForIndex(8); }
    if (value <= 3.505) { return this.belaqi.getColorForIndex(9); }
    return this.belaqi.getColorForIndex(10);
  }

  private categorizePM25(value: number): string {
    if (value <= 5.5) { return this.belaqi.getColorForIndex(1); }
    if (value <= 7.5) { return this.belaqi.getColorForIndex(2); }
    if (value <= 10.5) { return this.belaqi.getColorForIndex(3); }
    if (value <= 12.5) { return this.belaqi.getColorForIndex(4); }
    if (value <= 15.5) { return this.belaqi.getColorForIndex(5); }
    if (value <= 20.5) { return this.belaqi.getColorForIndex(6); }
    if (value <= 25.5) { return this.belaqi.getColorForIndex(7); }
    if (value <= 30.5) { return this.belaqi.getColorForIndex(8); }
    if (value <= 35.5) { return this.belaqi.getColorForIndex(9); }
    return this.belaqi.getColorForIndex(10);
  }

  private categorizePM10(value: number): string {
    if (value <= 10.5) { return this.belaqi.getColorForIndex(1); }
    if (value <= 15.5) { return this.belaqi.getColorForIndex(2); }
    if (value <= 20.5) { return this.belaqi.getColorForIndex(3); }
    if (value <= 25.5) { return this.belaqi.getColorForIndex(4); }
    if (value <= 30.5) { return this.belaqi.getColorForIndex(5); }
    if (value <= 35.5) { return this.belaqi.getColorForIndex(6); }
    if (value <= 40.5) { return this.belaqi.getColorForIndex(7); }
    if (value <= 45.5) { return this.belaqi.getColorForIndex(8); }
    if (value <= 50.5) { return this.belaqi.getColorForIndex(9); }
    return this.belaqi.getColorForIndex(10);
  }

  private categorizeO3(value: number): string {
    if (value <= 10.5) { return this.belaqi.getColorForIndex(1); }
    if (value <= 20.5) { return this.belaqi.getColorForIndex(2); }
    if (value <= 30.5) { return this.belaqi.getColorForIndex(3); }
    if (value <= 35.5) { return this.belaqi.getColorForIndex(4); }
    if (value <= 40.5) { return this.belaqi.getColorForIndex(5); }
    if (value <= 45.5) { return this.belaqi.getColorForIndex(6); }
    if (value <= 50.5) { return this.belaqi.getColorForIndex(7); }
    if (value <= 55.5) { return this.belaqi.getColorForIndex(8); }
    if (value <= 60.5) { return this.belaqi.getColorForIndex(9); }
    return this.belaqi.getColorForIndex(10);
  }

  private categorizeNO2(value: number): string {
    if (value <= 10.5) { return this.belaqi.getColorForIndex(1); }
    if (value <= 15.5) { return this.belaqi.getColorForIndex(2); }
    if (value <= 20.5) { return this.belaqi.getColorForIndex(3); }
    if (value <= 25.5) { return this.belaqi.getColorForIndex(4); }
    if (value <= 30.5) { return this.belaqi.getColorForIndex(5); }
    if (value <= 35.5) { return this.belaqi.getColorForIndex(6); }
    if (value <= 40.5) { return this.belaqi.getColorForIndex(7); }
    if (value <= 45.5) { return this.belaqi.getColorForIndex(8); }
    if (value <= 50.5) { return this.belaqi.getColorForIndex(9); }
    return this.belaqi.getColorForIndex(10);
  }
}
