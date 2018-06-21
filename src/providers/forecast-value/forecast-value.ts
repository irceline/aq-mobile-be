import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ValueProvider } from '../value-provider';

@Injectable()
export class ForecastValueProvider extends ValueProvider {

  constructor(
    public http: HttpService
  ) {
    super(http);
  }

  public getValue(latitude: number, longitude: number, time: Date): Observable<number> {
    const url = 'http://geo.irceline.be/forecast/wms';
    const params = {
      service: 'WMS',
      request: 'GetFeatureInfo',
      version: '1.1.1',
      layers: 'no2_maxhmean',
      info_format: 'application/json',
      tiled: 'true',
      time: moment(time).format('YYYY-MM-DD'),
      width: '1',
      height: '1',
      srs: 'EPSG:4326',
      bbox: this.calculateRequestBbox(latitude, longitude),
      query_layers: 'no2_maxhmean',
      X: '1',
      Y: '1'
    };
    return this.http.client().get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, { params }).pipe(
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
    )
  }
}
