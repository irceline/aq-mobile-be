import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MainPhenomenon } from '../../model/phenomenon';
import { LongTermDataPoint, Substance, UserLocation } from '../Interfaces';
import { BelAQIService } from './bel-aqi.service';

@Injectable({
  providedIn: 'root'
})
export class LongTermDataService {

  private _substances: Substance[] = [];

  private _years = [2015, 2016, 2017, 2018, 2019, 2020];

  constructor(translateService: TranslateService, private belaqiService: BelAQIService) {
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

  // this simulates an API request to fetch historical data
  // when integrating with API, all you need to do is refactor this method to fetch the actual data
  // if the output is structured in the same way (check interfaces), the app will be functional
  getLongTermDataFor(location: UserLocation): Promise<LongTermDataPoint[]> {
    // todo implementation task --> fetch long term data for this location
    return new Promise<LongTermDataPoint[]>((resolve, reject) => {
      setTimeout(() => {

        const data = this._substances.map(substance => {

          const belaqi_current = Math.ceil(Math.random() * 10);
          const currentValue = 20 + Math.ceil(Math.random() * 150);

          return {
            substance,
            location: location,
            currentValue: currentValue,
            averageValue: 40 + Math.ceil(Math.random() * 80),
            euBenchMark: 60 + Math.ceil(Math.random() * 60),
            worldBenchMark: 85 + Math.ceil(Math.random() * 50),
            evaluation: this.belaqiService.getLabelForIndex(belaqi_current),
            color: this.belaqiService.getLightColorForIndex(belaqi_current),
            historicalValues: this._years.map(year => {
              const belaqi_yearly = Math.ceil(Math.random() * 10);
              return {
                year,
                value: (year === 2020) ? currentValue : 20 + Math.ceil(Math.random() * 150),
                evaluationColor: (year === 2020) ?
                  this.belaqiService.getLightColorForIndex(belaqi_current)
                  : this.belaqiService.getLightColorForIndex(belaqi_yearly)
              };
            })
          };
        });

        resolve(data);
      }, 1000);
    });

  }

}
