import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

import { darkIndexColor, indexLabel, lightIndexColor } from '../common/constants';
import { ValueDate } from '../common/enums';
import { UserLocation } from '../Interfaces';
import { BelaqiIndexService } from './value-provider/belaqi-index.service';

export interface BelAqiIndexResult {
  location: UserLocation;
  valueDate: ValueDate;
  indexScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class BelAQIService {

  // default active index
  // Brussels
  public $activeIndex = new BehaviorSubject<BelAqiIndexResult>({
    location: { label: 'Brussel', postalCode: '1000', latitude: 50.8503396, longitude: 4.3517103, id: 2711, type: 'user' },
    valueDate: ValueDate.CURRENT,
    indexScore: 1
  });

  private _BelAqiResults: BelAqiIndexResult[] = [];

  constructor(
    private translate: TranslateService,
    private belaqiIndexSrvc: BelaqiIndexService
  ) { }

  // TODO: remove later
  // dummy function to get random index data
  getIndexScores(locations: UserLocation[], pastDays: number, nextDays: number): BelAqiIndexResult[] {
    const indices = [];

    locations.forEach(location => {
      for (let i = -1 * pastDays; i <= nextDays; i++) {
        indices.push({
          location,
          date: moment().add(i, 'days'),
          indexScore: Math.ceil(Math.random() * 10)
        });
      }
    });

    return indices;
  }

  public getIndexScoresAsObservable(location: UserLocation): Observable<BelAqiIndexResult[]> {
    return this.belaqiIndexSrvc.getIndexScores(location);
  }

  public set activeIndex(index: BelAqiIndexResult) {
    this.$activeIndex.next(index);
  }

  // https://app.zeplin.io/project/5ea9b038b472cbbc682ced04/screen/5eb8f28f40d46577a6abe316
  // light versions
  public getLightColorForIndex(index: number) {
    if (index >= 1 && index <= 10) {
      return lightIndexColor[index];
    } else {
      return null;
    }
  }

  // dark versions
  public getDarkColorForIndex(index: number) {
    if (index >= 1 && index <= 10) {
      return darkIndexColor[index];
    } else {
      return null;
    }
  }

  public getLabelForIndex(index: number) {
    if (index >= 1 && index <= 10) {
      return this.translate.instant(indexLabel[index]);
    } else {
      return null;
    }
  }

}
