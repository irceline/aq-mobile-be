import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { LocationMode } from '../../providers/locate/locate';

@Component({
  selector: 'geolocation-enabled-icon-popup',
  templateUrl: 'geolocation-enabled-icon-popup.html'
})
export class GeolocationEnabledIconPopupComponent {

  locationMode: LocationMode;

  constructor(
    private navParams: NavParams
  ) {
    this.locationMode = this.navParams.get('locationMode');
  }

}
