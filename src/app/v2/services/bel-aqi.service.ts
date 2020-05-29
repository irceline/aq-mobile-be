import { Injectable } from '@angular/core';
import {UserLocation} from '../Interfaces';
import moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {Moment} from 'moment';
import {BehaviorSubject} from 'rxjs';
import { lightIndexColor, darkIndexColor, indexLabel } from '../common/constants';

export interface BelAqiIndexResult {
  location: UserLocation;
  date: Moment;
  indexScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class BelAQIService {

  // default active index
  // Brussels
  public $activeIndex = new BehaviorSubject<BelAqiIndexResult>({
    location: {label: 'Brussel', postalCode: '1000', latitude: 50.8503396, longitude: 4.3517103, id: 2711, type: 'user'},
    date: moment(),
    indexScore: Math.ceil(Math.random() * 10)
  });

  private _BelAqiResults: BelAqiIndexResult[] = [];

  constructor(private translate: TranslateService) {

  }

  // dummy function to get random index data
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

  public set activeIndex( index: BelAqiIndexResult ) {
    this.$activeIndex.next(index);
  }

  // https://app.zeplin.io/project/5ea9b038b472cbbc682ced04/screen/5eb8f28f40d46577a6abe316
  // light versions
  public getLightColorForIndex(index: number) {
    return lightIndexColor[index] || null;
  }

  // dark versions
  public getDarkColorForIndex(index: number) {
    return darkIndexColor[index] || null;
  }

  public getLabelForIndex(index: number) {
    return this.translate.instant(indexLabel[index]) || null;
  }

}
