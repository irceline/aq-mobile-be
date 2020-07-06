import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MainPhenomenon } from '../common/phenomenon';
import { LongTermDataPoint, Substance, UserLocation } from '../Interfaces';
import { BelAQIService } from './bel-aqi.service';
import { AnnualMeanValueService } from './value-provider/annual-mean-value.service';
import { ModelledValueService } from './value-provider/modelled-value.service';

@Injectable({
  providedIn: 'root'
})
export class LongTermDataService {

  private _substances: Substance[] = [];

  constructor(
    translateService: TranslateService,
    private belaqiService: BelAQIService,
    private annualMeanValueSrvc: AnnualMeanValueService,
    private modelledValueSrvc: ModelledValueService
  ) {
    this._substances = [
      {
        name: translateService.instant('v2.screens.app-info.ozon'),
        abbreviation: 'O&#8323;',
        unit: 'µg/m3',
        phenomenon: MainPhenomenon.O3
      },
      {
        name: translateService.instant('v2.screens.app-info.nitrogen-dioxide'),
        abbreviation: 'NO&#8322;',
        unit: 'µg/m3',
        phenomenon: MainPhenomenon.NO2
      },
      {
        name: translateService.instant('v2.screens.app-info.fine-dust'),
        abbreviation: 'PM 10',
        unit: 'µg/m3',
        phenomenon: MainPhenomenon.PM10
      },
      {
        name: translateService.instant('v2.screens.app-info.very-fine-dust'),
        abbreviation: 'PM 2,5',
        unit: 'µg/m3',
        phenomenon: MainPhenomenon.PM25
      },
    ];
  }

  getLongTermDataFor(location: UserLocation): Promise<LongTermDataPoint[]> {
    return forkJoin(this._substances.map(substance => this.getLongTermDataForSubstance(substance, location))).toPromise();
  }

  private getLongTermDataForSubstance(substance: Substance, location: UserLocation): Observable<LongTermDataPoint> {
    return forkJoin([
      this.modelledValueSrvc.getCurrentValue(location, substance.phenomenon),
      this.annualMeanValueSrvc.getAnnualValueList(location, substance.phenomenon)
    ]).pipe(map(res => {
      const currentIndex = res[0].index;
      const currentValue = Math.round(res[0].value);
      const historicalValues = res[1].reverse().map(e => {
        return {
          year: e.year,
          value: Math.round(e.value),
          evaluationColor: this.belaqiService.getLightColorForIndex(e.index)
        };
      });
      return {
        substance,
        location: location,
        currentValue: currentValue,
        averageValue: null,
        euBenchMark: this.getEuBenchMark(substance.phenomenon),
        worldBenchMark: this.getWorldBenchMark(substance.phenomenon),
        evaluation: this.belaqiService.getLabelForIndex(currentIndex),
        color: this.belaqiService.getLightColorForIndex(currentIndex),
        historicalValues
      };
    }));
  }

  private getWorldBenchMark(phenomenon: MainPhenomenon): number {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return 40;
      case MainPhenomenon.PM25:
        return 25;
      default:
        return null;
    }
  }

  private getEuBenchMark(phenomenon: MainPhenomenon): number {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return 40;
      case MainPhenomenon.PM25:
        return 10;
      default:
        return null;
    }
  }
}
