import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ValueProvider } from '../value-provider';

@Injectable()
export class ModelledValueProvider extends ValueProvider {

  constructor(
    public http: HttpService
  ) {
    super(http);
  }

  // TODO add layerType (NO2, ...)
  public getValue(latitude: number, longitude: number, time: Date): Observable<number> {
    const url = 'http://geo.irceline.be/rioifdm/wms';
    const params = {
      service: 'WMS',
      request: 'GetFeatureInfo',
      version: '1.1.1',
      layers: 'rioifdm:no2_hmean',
      transparent: 'true',
      info_format: 'application/json',
      tiled: 'true',
      time: time.toISOString(), // '2018-03-22T08:00:00.000Z',
      width: '1',
      height: '1',
      srs: 'EPSG:4326',
      bbox: this.calculateRequestBbox(latitude, longitude),
      query_layers: 'rioifdm:no2_hmean',
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
    );
  }
}
