import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createCacheKey } from '../../model/caching';
import { MainPhenomenon } from '../../model/phenomenon';
import { realtimeWfsURL } from '../../model/services';
import { BelaqiIndexService } from '../belaqi/belaqi.service';
import { CategorizedValueService } from '../categorized-value/categorized-value.service';

export interface DailyMeanValue {
  index: number;
  color: string;
  value: number;
}

@Injectable()
export class DailyMeanValueService {

  constructor(
    public http: HttpClient,
    private cacheService: CacheService,
    private categorizeSrvc: CategorizedValueService,
    private belaqi: BelaqiIndexService
  ) { }

  public get24hValue(stationID: string, time: Date, phenomenon: MainPhenomenon): Observable<DailyMeanValue> {
    if (phenomenon === MainPhenomenon.PM10 || phenomenon === MainPhenomenon.PM25) {
      const layerId = MainPhenomenon.PM10 ? 'pm10_24hmean_station' : 'pm25_24hmean_station';
      return this.fetchValue({
        stationID,
        time,
        phenomenon,
        layerId,
        url: realtimeWfsURL
      });
    } else {
      throw new Error(`Phenomenon not supported: ${phenomenon}`);
    }
  }

  private fetchValue(param: {
    stationID: string;
    layerId: string;
    time: Date;
    phenomenon: MainPhenomenon;
    url: string;
  }): Observable<DailyMeanValue> {
    const requestParams = {
      service: 'WFS',
      version: '2.0',
      request: 'GetFeature',
      typeNames: param.layerId,
      srsName: 'EPSG:4326',
      outputFormat: 'application/json',
      cql_filter: `ab_name='${param.stationID}' AND timestamp='${param.time.toISOString()}'`
    };
    const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(param.url, { params: requestParams });
    return this.cacheService.loadFromObservable(createCacheKey(param.url, JSON.stringify(requestParams), param.time), request).pipe(
      map(res => {
        if (res && res.features && res.features.length >= 1) {
          const feature = res.features[0];
          const value = feature.properties.value;
          const index = this.categorizeSrvc.categorize(value, param.phenomenon);
          const color = this.belaqi.getColorForIndex(index);
          return { color, index, value } as DailyMeanValue;
        } else {
          // throw new Error('No value returned');
        }
      })
    );
  }

}
