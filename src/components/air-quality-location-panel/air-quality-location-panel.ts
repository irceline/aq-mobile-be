import { Component } from '@angular/core';
import { Geoposition } from '@ionic-native/geolocation';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LocateProvider } from '../../providers/locate/locate';

@Component({
  selector: 'air-quality-location-panel',
  templateUrl: 'air-quality-location-panel.html'
})
export class AirQualityLocationPanelComponent {

  public value: number;
  public loading: boolean;
  public error: boolean;
  public time: Date;

  constructor(
    private locate: LocateProvider,
    private belaqiIndex: BelaqiIndexProvider,
    private ircelineSettings: IrcelineSettingsProvider,
  ) {
    this.loading = true;
    this.locate.getGeoposition().subscribe(pos => this.getValue(pos));
  }

  private getValue(position: Geoposition) {
    this.ircelineSettings.getSettings(false).subscribe(ircelineSettings => this.time = ircelineSettings.lastupdate);
    this.belaqiIndex.getValue(position.coords.latitude, position.coords.longitude)
      .subscribe(
        res => {
          this.value = res;
          this.loading = false;
        },
        error => {
          this.error = true;
          this.value = 0;
          this.loading = false;
        });
  }

}
