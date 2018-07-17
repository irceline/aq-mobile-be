import { Component } from '@angular/core';
import { GeoSearch } from '@helgoland/map';
import { Geoposition } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LocateProvider } from '../../providers/locate/locate';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';

interface BelaqiLocation {
  index: number;
  locationLabel: string;
  date: Date;
}

@Component({
  selector: 'belaqi-user-location-slider',
  templateUrl: 'belaqi-user-location-slider.html'
})
export class BelaqiUserLocationSliderComponent {

  public belaqiLocations: BelaqiLocation[] = [];
  public currentLocation: BelaqiLocation;

  constructor(
    private belaqiIndexProvider: BelaqiIndexProvider,
    private userLocationProvider: UserLocationListProvider,
    private ircelineSettings: IrcelineSettingsProvider,
    private locate: LocateProvider,
    private translate: TranslateService,
    private geoSearch: GeoSearch
  ) {
    this.loadBelaqis();
    this.loadBelaqiForCurrentLocation();
  }

  private loadBelaqiForCurrentLocation() {

    this.locate.onPositionUpdate.subscribe((pos: Geoposition) => {
      const ircelSetObs = this.ircelineSettings.getSettings(false);
      const belaqiObs = this.belaqiIndexProvider.getValue(pos.coords.latitude, pos.coords.longitude);
      const reverseObs = this.geoSearch.reverse({ type: 'Point', coordinates: [pos.coords.latitude, pos.coords.longitude] });
      forkJoin([ircelSetObs, belaqiObs, reverseObs]).subscribe(value => {
        const locationLabel = value[2].displayName || this.translate.instant('belaqi-user-location-slider.current-location');
        this.currentLocation = {
          index: value[1],
          locationLabel,
          date: value[0].lastupdate
        };
      }, error => { });
    });
  }

  private loadBelaqis() {
    this.belaqiLocations = [];
    this.ircelineSettings.getSettings(false).subscribe(ircelineSettings => {
      this.userLocationProvider.getLocationsPromise().subscribe(
        locations => locations.forEach((loc, index) => {
          this.belaqiIndexProvider.getValue(loc.point.coordinates[1], loc.point.coordinates[0]).subscribe(
            res => {
              this.belaqiLocations.push({
                index: res,
                locationLabel: loc.label,
                date: ircelineSettings.lastupdate
              });
            }
          )
        })
      );
    });
  }

}
