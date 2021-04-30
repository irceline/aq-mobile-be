import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MainPhenomenon } from '../common/phenomenon';
import { LongTermDataPoint, Substance, UserLocation } from '../Interfaces';
import { BelAQIService } from './bel-aqi.service';
import { AnnualMeanValue, AnnualMeanValueService } from './value-provider/annual-mean-value.service';
import { BelaqiIndexService } from './value-provider/belaqi-index.service';
import { ModelledValueService } from './value-provider/modelled-value.service';

@Injectable({
  providedIn: 'root'
})
export class LongTermDataService {

  private _substances: Substance[] = [];

  constructor(
    translateService: TranslateService,
    private belaqiService: BelAQIService,
    private belaqiIndexSrvc: BelaqiIndexService,
    private annualMeanValueSrvc: AnnualMeanValueService,
    private modelledValueSrvc: ModelledValueService
  ) {
    this._substances = [
      {
        name: translateService.instant('v2.screens.app-info.belaqi-title'),
        abbreviation: 'BelAQI',
        phenomenon: MainPhenomenon.BELAQI
      },
      {
        name: translateService.instant('v2.screens.app-info.nitrogen-dioxide'),
        abbreviation: 'NO₂',
        unit: 'µg/m³',
        phenomenon: MainPhenomenon.NO2
      },
      {
        name: translateService.instant('v2.screens.app-info.very-fine-dust'),
        abbreviation: 'PM 2.5',
        unit: 'µg/m³',
        phenomenon: MainPhenomenon.PM25
      },
      {
        name: translateService.instant('v2.screens.app-info.fine-dust'),
        abbreviation: 'PM 10',
        unit: 'µg/m³',
        phenomenon: MainPhenomenon.PM10
      },
      {
        name: translateService.instant('v2.screens.app-info.ozon'),
        abbreviation: 'O₃',
        unit: 'µg/m³',
        phenomenon: MainPhenomenon.O3
      },
    ];
  }

  getLongTermDataFor(location: UserLocation): Promise<LongTermDataPoint[]> {
    return forkJoin(this._substances.map(substance => this.getLongTermDataForSubstance(substance, location))).toPromise();
  }

  private getLongTermDataForSubstance(substance: Substance, location: UserLocation): Observable<LongTermDataPoint> {
    if (substance.phenomenon === MainPhenomenon.BELAQI) {
      return forkJoin([
        this.belaqiIndexSrvc.getCurrentIndex(location),
        this.annualMeanValueSrvc.getAnnualValueList(location, substance.phenomenon)
      ]).pipe(map(res => {
        // const currentIndex = res[0].indexScore;
        // select last index instead of 
        const currentIndex = res[1][0].index;
        const historicalValues = res[1].reverse().filter(e => e != null).map(e => {
          return {
            year: e.year,
            value: Math.round(e.value) * 5,
            evaluationColor: this.getEvaluationColor(e, substance.phenomenon)
          };
        });
        return {
          substance,
          location: location,
          // currentValue: this.belaqiService.getLabelForIndex(currentIndex),
          currentIndex: currentIndex,
          averageValue: null,
          showValues: false,
          euBenchMark: this.getEuBenchMark(substance.phenomenon),
          worldBenchMark: this.getWorldBenchMark(substance.phenomenon),
          evaluation: this.belaqiService.getLabelForIndex(currentIndex),
          color: this.belaqiService.getLightColorForIndex(currentIndex),
          historicalValues
        };
      }));
    } else {
      return forkJoin([
        this.modelledValueSrvc.getCurrentValue(location, substance.phenomenon),
        this.annualMeanValueSrvc.getAnnualValueList(location, substance.phenomenon)
      ]).pipe(map(res => {
        // const currentIndex = res[0].index;
        // const currentValue = Math.round(res[0].value);
        const lastEntry = res[1][0];
        const currentIndex = lastEntry.index;
        const currentValue = lastEntry.value;
        const historicalValues = res[1].reverse().map(e => {
          return {
            year: e.year,
            value: Math.round(e.value),
            evaluationColor: this.getEvaluationColor(e, substance.phenomenon)
          };
        });
        return {
          substance,
          location: location,
          currentValue: currentValue,
          averageValue: null,
          showValues: true,
          euBenchMark: this.getEuBenchMark(substance.phenomenon),
          worldBenchMark: this.getWorldBenchMark(substance.phenomenon),
          evaluation: this.belaqiService.getLabelForIndex(currentIndex),
          color: this.belaqiService.getLightColorForIndex(currentIndex),
          historicalValues
        };
      }));
    }
  }

  private getEvaluationColor(e: AnnualMeanValue, phenomenon: MainPhenomenon): string {
    switch ((phenomenon)) {
      case MainPhenomenon.O3:
        return 'grey';
      default:
        return this.belaqiService.getLightColorForIndex(e.index);
    }
  }

  private getWorldBenchMark(phenomenon: MainPhenomenon): number {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return 40;
      case MainPhenomenon.PM10:
        return 20;
      case MainPhenomenon.PM25:
        return 10;
      default:
        return null;
    }
  }

  private getEuBenchMark(phenomenon: MainPhenomenon): number {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return 40;
      case MainPhenomenon.PM25:
        return 20;
      default:
        return null;
    }
  }
}
