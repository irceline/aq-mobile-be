import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { UserLocation, UserLocationListProvider } from '../../providers/user-location-list/user-location-list';

interface EditableUserLocation extends UserLocation {
  editStatus: boolean;
}

@Component({
  selector: 'modal-user-location-list',
  templateUrl: 'modal-user-location-list.html'
})
export class ModalUserLocationListComponent {

  public userLocations: EditableUserLocation[];

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

  public editLabel(location: EditableUserLocation) {
    location.editStatus = true;
  }

  public remove(location: EditableUserLocation) {
    this.userLocationProvider.removeLocation(location);
    this.setLocations();
  }

  public saveLocation(location: EditableUserLocation) {
    location.editStatus = false;
    this.userLocationProvider.saveLocation(location);
  }

  private setLocations() {
    this.userLocations = this.userLocationProvider.getLocations() as EditableUserLocation[];
  }

}
