import { Injectable } from '@angular/core';

import { BelaqiSelection } from '../../components/belaqi-user-location-slider/belaqi-user-location-slider.component';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {

  public selection: BelaqiSelection;

}
