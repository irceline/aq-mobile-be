import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ValueProvider } from '../value-provider';

@Injectable()
export class BelaqiIndexProvider extends ValueProvider {

  constructor(
    http: HttpService,
    private translate: TranslateService
  ) {
    super(http);
  }

  public getValue(latitude: number, longitude: number, time?: Date): Observable<number> {
    const url = 'http://geo.irceline.be/rioifdm/belaqi/wms';
    return this.http.client().get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url,
      {
        responseType: 'json',
        params: {
          request: 'GetFeatureInfo',
          bbox: this.calculateRequestBbox(latitude, longitude),
          service: 'WMS',
          info_format: 'application/json',
          query_layers: 'rioifdm:belaqi',
          layers: 'rioifdm:belaqi',
          width: '1',
          height: '1',
          srs: 'EPSG:4326',
          version: '1.1.1',
          // time: moment(time).format('YYYY-MM-DD'),
          X: '1',
          Y: '1'
        }
      }
    ).pipe(
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
    )
  }

  public getLabelForIndex(index: number) {
    switch (index) {
      case 1:
        return this.translate.instant('belaqi.level.excellent');
      case 2:
        return this.translate.instant('belaqi.level.very-good');
      case 3:
        return this.translate.instant('belaqi.level.good');
      case 4:
        return this.translate.instant('belaqi.level.fairly-good');
      case 5:
        return this.translate.instant('belaqi.level.moderate');
      case 6:
        return this.translate.instant('belaqi.level.poor');
      case 7:
        return this.translate.instant('belaqi.level.very-poor');
      case 8:
        return this.translate.instant('belaqi.level.bad');
      case 9:
        return this.translate.instant('belaqi.level.very-bad');
      case 10:
        return this.translate.instant('belaqi.level.horrible');
      default:
        return null;
    }
  }

}
