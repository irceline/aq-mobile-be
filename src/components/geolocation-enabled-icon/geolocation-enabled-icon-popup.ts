import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'geolocation-enabled-icon-popup',
  templateUrl: 'geolocation-enabled-icon-popup.html'
})
export class GeolocationEnabledIconPopupComponent {

  geolocationEnabled: boolean;

  constructor(
    private navParams: NavParams
  ) {
    this.geolocationEnabled = this.navParams.get('geolocationEnabled');
  }

}
