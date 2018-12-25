import { Injectable } from '@angular/core';
import { ColorService, DatasetApiInterface, DatasetOptions } from '@helgoland/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const colorMapping = {
  '391': '#224444', // BC
  '8': '#5522CC', // NO2
  '7': '#227799', // O3
  '5': '#777711', // PM10
  '6001': '#55AA00', // PM25
}

const seperateYAxisForPhenomenon = [
  // '391' // BC
]

@Injectable()
export class DatasetOptionsModifier {

  constructor(
    private api: DatasetApiInterface,
    private color: ColorService
  ) { }

  createOptions(internalId: string): Observable<DatasetOptions> {
    return this.api.getSingleTimeseriesByInternalId(internalId).pipe(map(res => {
      const color = colorMapping[res.parameters.phenomenon.id] || this.color.getColor();
      const options = new DatasetOptions(internalId, color);
      options.pointRadius = 2;
      options.generalize = false;
      options.zeroBasedYAxis = true;
      options.separateYAxis = seperateYAxisForPhenomenon.findIndex(e => e === res.parameters.phenomenon.id) > -1;
      return options;
    }))
  }

}
