import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ValueProvider } from '../value-provider';

export interface BelaqiTimeline {
  preSixHour: number;
  preFiveHour: number;
  preFourHour: number;
  preThreeHour: number;
  preTwoHour: number;
  preOneHour: number;
  now: number;
  tomorrow: number;
  todayPlusTwo: number;
  todayPlusThree: number;
}

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

  public getTimeline(latitude: number, longitude: number, time: Date): Observable<BelaqiTimeline> {
    const randomIndex = () => Math.floor(Math.random() * 10 + 1);
    const temp: BelaqiTimeline = {
      preSixHour: randomIndex(),
      preFiveHour: randomIndex(),
      preFourHour: randomIndex(),
      preThreeHour: randomIndex(),
      preTwoHour: randomIndex(),
      preOneHour: randomIndex(),
      now: randomIndex(),
      tomorrow: randomIndex(),
      todayPlusTwo: randomIndex(),
      todayPlusThree: randomIndex()
    }
    return of(temp);
  }

  public getColorForIndex(index: number) {
    switch (index) {
      case 1: return '#0000FF';
      case 2: return '#0099FF';
      case 3: return '#009900';
      case 4: return '#00FF00';
      case 5: return '#FFFF00';
      case 6: return '#FFBB00';
      case 7: return '#FF6600';
      case 8: return '#FF0000';
      case 9: return '#990000';
      case 10: return '#660000';
      default: return null;
    }
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

  // http://geo.irceline.be/rioifdm/wcs?request=GetCoverage&service=WCS&version=2.0.1&coverageId=rioifdm__belaqi&Format=text/plain&subset=Lat(50.7116008)&subset=Long(4.1223895)&subset=http://www.opengis.net/def/axis/OGC/0/time(%222018-07-12T09:00:00.000Z%22)
  // http://geo.irceline.be/rioifdm/wcs?request=GetCoverage&service=WCS&version=2.0.1&coverageId=rioifdm__belaqi&Format=text/plain&subset=http://www.opengis.net/def/axis/OGC/0/X(155700,155800)&subset=http://www.opengis.net/def/axis/OGC/0/Y(132600,132700)&subset=http://www.opengis.net/def/axis/OGC/0/time(%222018-07-12T09:00:00.000Z%22)
  // http://geo.irceline.be/rioifdm/wcs?request=GetCoverage&service=WCS&version=2.0.1&coverageId=rioifdm__belaqi&Format=gml&subset=http://www.opengis.net/def/axis/OGC/0/X(155700,155800)&subset=http://www.opengis.net/def/axis/OGC/0/Y(132600,132700)&subset=http://www.opengis.net/def/axis/OGC/0/time(%222018-07-12T09:00:00.000Z%22)

}
