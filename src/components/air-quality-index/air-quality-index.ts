import { Component, EventEmitter, Output } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearch } from '@helgoland/map';

import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'air-quality-index',
  templateUrl: 'air-quality-index.html'
})
export class AirQualityIndexComponent {

  @Output()
  public onBoundsUpdated: EventEmitter<L.LatLngBoundsExpression> = new EventEmitter<L.LatLngBoundsExpression>();

  public regions: string[];

  constructor(
    private settings: SettingsService<MobileSettings>,
    private geoSearch: GeoSearch
  ) {
    this.regions = this.settings.getSettings().regions;
  }

  public onChange(region) {
    this.geoSearch.searchTerm(region, { countrycodes: this.settings.getSettings().geoSearchContryCodes }).subscribe(res => {
      if (res.bounds) {
        this.onBoundsUpdated.emit(res.bounds)
      }
    });
  }
}
