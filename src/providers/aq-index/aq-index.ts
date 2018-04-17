import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AqIndex {

  constructor(
    public http: HttpClient
  ) { }

  public getIndex(latitude: number, longitude: number, time: Date): Observable<number> {
    const url = 'http://geo.irceline.be/rioifdm/wms';
    const params = {
      service: 'WMS',
      request: 'GetFeatureInfo',
      version: '1.1.1',
      layers: 'rioifdm:no2_hmean',
      styles: '',
      transparent: 'true',
      info_format: 'application/json',
      tiled: 'true',
      time: '2018-04-14T08:00:00.000Z', // '2018-03-22T08:00:00.000Z',
      width: '1440',
      height: '348',
      srs: 'EPSG:4326',
      bbox: this.calculateRequestBbox(latitude, longitude),
      query_layers: 'rioifdm:no2_hmean',
      X: '1',
      Y: '1'
    };
    return this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, { params })
      .map(res => {
        if (res && res.features && res.features.length === 1) {
          if (res.features[0].properties['GRAY_INDEX']) {
            return res.features[0].properties['GRAY_INDEX'];
          }
          return 0;
        } else {
          throw new Error('No Index returned');
        }
      });
  }

  private calculateRequestBbox(latitude: number, longitude: number): string {
    const r_earth = 6378;
    const buf = 0.05
    const pi = Math.PI;
    const minLatitude = latitude - (buf / r_earth) * (180 / pi);
    const maxLatitude = latitude + (buf / r_earth) * (180 / pi);
    const minLongitude = longitude - (buf / r_earth) * (180 / pi) / Math.cos(latitude * pi / 180);
    const maxLongitude = longitude + (buf / r_earth) * (180 / pi) / Math.cos(latitude * pi / 180);
    return minLongitude + ',' + minLatitude + ',' + maxLongitude + ',' + maxLatitude;
  }
}
