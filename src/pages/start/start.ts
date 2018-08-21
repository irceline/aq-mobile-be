import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LocateProvider } from '../../providers/locate/locate';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { CombinedMapPage } from '../combined-map/combined-map';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  public locationEnabled: boolean;
  public locationCount: number;

  constructor(
    private nav: NavController,
    private locate: LocateProvider,
    private userLocations: UserLocationListProvider
  ) {
    this.locate.getLocationStateEnabled().subscribe(enabled => this.locationEnabled = enabled);
    this.userLocations.getLocationsPromise().subscribe(list => this.locationCount = list.length);
  }

  public navigateToMap(phenomenonId: string) {
    this.nav.push(CombinedMapPage, { phenomenonId });
  }

}
