import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createCacheKey } from '../../model/caching';
import { MainPhenomenon } from '../../model/phenomenon';
import { rioifdmWmsURL } from '../../model/services';
import { ValueProvider } from '../value-provider';

enum ModelledPhenomenon {
  no2 = 'rioifdm:no2_hmean',
  o3 = 'rioifdm:o3_hmean',
  pm10 = 'rioifdm:pm10_24hmean',
  pm25 = 'rioifdm:pm25_24hmean'
}

@Injectable()
export class ModelledValueService extends ValueProvider {

  constructor(
    public http: HttpClient,
    private cacheService: CacheService
  ) {
    super(http);
  }

  // TODO add layerType (NO2, ...)
  public getValue(latitude: number, longitude: number, time: Date, phenomenon?: MainPhenomenon): Observable<number> {
    const layerId = this.createLayerId(phenomenon);
    const params = {
      service: 'WMS',
      request: 'GetFeatureInfo',
      version: '1.1.1',
      layers: layerId,
      info_format: 'application/json',
      time: time.toISOString(), // '2018-03-22T08:00:00.000Z',
      width: '1',
      height: '1',
      srs: 'EPSG:4326',
      bbox: this.calculateRequestBbox(latitude, longitude),
      query_layers: layerId,
      X: '1',
      Y: '1'
    };
    const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(rioifdmWmsURL, { params });
    return this.cacheService.loadFromObservable(createCacheKey(rioifdmWmsURL, JSON.stringify(params), time), request).pipe(
      map(res => {
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

  private createLayerId(phenomenon: MainPhenomenon) {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return ModelledPhenomenon.no2.toString();
      case MainPhenomenon.O3:
        return ModelledPhenomenon.o3.toString();
      case MainPhenomenon.PM10:
        return ModelledPhenomenon.pm10.toString();
      case MainPhenomenon.PM25:
        return ModelledPhenomenon.pm25.toString();
    }
  }
}
