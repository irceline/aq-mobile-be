import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LocateProvider } from '../../providers/locate/locate';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  public locationEnabled: boolean;
  public locationCount: number;
  public name = 'start';

  constructor(
    private nav: NavController,
    private locate: LocateProvider,
    private userLocations: UserLocationListProvider
  ) {
    this.locate.getLocationStateEnabled().subscribe(enabled => this.locationEnabled = enabled);
    this.userLocations.getAllLocations().subscribe(list => this.locationCount = list.length);
  }

  public navigateToMap(phenomenonId: string) {
    this.nav.push(MapPage, { phenomenonId });
  }

}
