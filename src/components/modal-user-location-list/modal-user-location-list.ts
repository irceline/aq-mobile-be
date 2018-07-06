import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { UserLocation, UserLocationListProvider } from '../../providers/user-location-list/user-location-list';

@Component({
  selector: 'modal-user-location-list',
  templateUrl: 'modal-user-location-list.html'
})
export class ModalUserLocationListComponent {

  public userLocations: UserLocation[];

  public editing = {};

  public mapOptions: MapOptions = {
    maxZoom: 14
  }

  constructor(
    private userLocationProvider: UserLocationListProvider,
    private viewCtrl: ViewController
  ) {
    this.setLocations();
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public remove(location: UserLocation) {
    this.userLocationProvider.removeLocation(location);
    this.setLocations();
  }

  public saveLocation(location: UserLocation) {
    this.userLocationProvider.saveLocation(location);
  }

  private setLocations() {
    this.userLocations = this.userLocationProvider.getLocations() as UserLocation[];
  }

}
