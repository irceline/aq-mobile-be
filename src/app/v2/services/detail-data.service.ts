import { Injectable } from '@angular/core';
import {Moment} from 'moment';
import {UserLocation} from '../Interfaces';
import {TranslateService} from '@ngx-translate/core';
import {BelAQIService} from './bel-aqi.service';

export interface Substance {
  name: string;
  abbreviation: string;
  unit: string;
}

export interface DetailDataPoint {
  location: UserLocation;
  day: Moment;
  substance: Substance;
  currentValue: number;
  averageValue: number;
  // todo -> thresholds , on data point or not?
  // thresholds set on server side or defined in client?
  // for now, taking random values
  evaluation: string;
  color: string;
}


@Injectable({
  providedIn: 'root'
})
export class DetailDataService {

  private _substances: Substance[] = [];

  constructor( translateService: TranslateService, private belaqiService: BelAQIService ) {
    this._substances = [
      {
        name: translateService.instant('v2.screens.app-info.ozon'),
        abbreviation: 'O&#8323;',
        unit: 'µg/m3'
      },
      {
        name: translateService.instant('v2.screens.app-info.nitrogen-dioxide'),
        abbreviation: 'NO&#8322;',
        unit: 'µg/m3'
      },
      {
        name: translateService.instant('v2.screens.app-info.fine-dust'),
        abbreviation: 'PM 10',
        unit: 'µg/m3'
      },
      {
        name: translateService.instant('v2.screens.app-info.very-fine-dust'),
        abbreviation: 'PM 2,5',
        unit: 'µg/m3'
      },
    ];
  }

  public getMeasurementsFor( location: UserLocation, day: Moment ): Promise<DetailDataPoint[]> {
    // todo -> api call for getting measurements on this day.
    return new Promise<DetailDataPoint[]>( ((resolve, reject) => {

      setTimeout( () => {
        resolve(this._getRandomValuesForSubstance(location, day));
      }, 1000);

    }));
  }

  private _getRandomValuesForSubstance(location: UserLocation, day: Moment): DetailDataPoint[] {
    return this._substances.map( s => {

      // we are using a random belaqi index to get matching correct colors and text
      // todo: set thresholds, ...

      const belaqi =  Math.ceil( Math.random() * 10 );

      return {
        location,
        day,
        substance: s,
        currentValue: 20 +  Math.ceil( Math.random() * 150 ),
        averageValue: 40 + Math.ceil( Math.random() * 80 ),
        evaluation: this.belaqiService.getLabelForIndex(belaqi),
        color: this.belaqiService.getLightColorForIndex(belaqi)
      };
    });
  }
}
