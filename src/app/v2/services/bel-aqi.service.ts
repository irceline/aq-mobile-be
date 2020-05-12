import { Injectable } from '@angular/core';
import {UserLocation} from '../Interfaces';
import moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {Moment} from 'moment';


export interface BelAqiIndexResult {
  location: UserLocation;
  date: Moment;
  indexScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class BelAQIService {

  constructor(private translate: TranslateService) { }

  getIndexScores( locations: UserLocation[], pastDays: number, nextDays: number ): BelAqiIndexResult[] {
    const indices = [];

    locations.forEach( location => {
      for ( let i = -1 * pastDays ; i <= nextDays ; i++ ) {
        indices.push({
          location,
          date: moment().add(i, 'days'),
          indexScore: Math.ceil(Math.random() * 10)
        });
      }
    });

    return indices;

  }

  // https://app.zeplin.io/project/5ea9b038b472cbbc682ced04/screen/5eb8f28f40d46577a6abe316
  // light versions
  public getLightColorForIndex(index: number) {
    switch (index) {
      case 1: return '#238cff';
      case 2: return '#29cdf7';
      case 3: return '#30e14d';
      case 4: return '#2df16b';
      case 5: return '#f0d426';
      case 6: return '#ff9609';
      case 7: return '#ff812e';
      case 8: return '#ff4a2e';
      case 9: return '#c72955';
      case 10: return '#822e45';
      default: return null;
    }
  }

  // dark versions
  public getDarkColorForIndex(index: number) {
    switch (index) {
      case 1: return '#1e7ae0';
      case 2: return '#54bad3';
      case 3: return '#29c442';
      case 4: return '#27d25d';
      case 5: return '#e3c823';
      case 6: return '#de8207';
      case 7: return '#de5328';
      case 8: return '#de3f28';
      case 9: return '#af234a';
      case 10: return '#5d141e';
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

}
