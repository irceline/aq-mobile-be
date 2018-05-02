import { Component, EventEmitter, Output } from '@angular/core';
import { LanguageChangNotifier, SettingsService } from '@helgoland/core';
import { GeoSearch } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';

import { AirQualityIndex, AirQualityIndexProvider } from '../../providers/air-quality-index/air-quality-index';
import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'air-quality-index',
  templateUrl: 'air-quality-index.html'
})
export class AirQualityIndexComponent extends LanguageChangNotifier {

  @Output()
  public onBoundsUpdated: EventEmitter<L.LatLngBoundsExpression> = new EventEmitter<L.LatLngBoundsExpression>();

  public regions: string[];
  public regionLabel: string;
  public selectedRegion: string;
  public airQualityIndex: AirQualityIndex[];

  constructor(
    private settings: SettingsService<MobileSettings>,
    private geoSearch: GeoSearch,
    private aqIndex: AirQualityIndexProvider,
    protected translate: TranslateService
  ) {
    super(translate);
    this.regions = this.settings.getSettings().regions;
    this.selectedRegion = this.regions[0];
    this.onChange(this.selectedRegion);
  }

  protected languageChanged(): void {
    this.onChange(this.selectedRegion);
  }

  public onChange(region: string) {
    this.selectAqIndex(region);
    this.geoSearch.searchTerm(region, { countrycodes: this.settings.getSettings().geoSearchContryCodes }).subscribe(res => {
      if (res.bounds) {
        this.onBoundsUpdated.emit(res.bounds)
      }
    });
  }

  private selectAqIndex(region) {
    this.airQualityIndex = [];
    this.aqIndex.getAirQualityIndex().subscribe(res => {
      if (res[region]) {
        this.regionLabel = res[region].label;
        this.airQualityIndex = res[region].index;
      }
    })
  }
}
