import { Component } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { UserLocation, UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { ModalUserLocationCreationComponent } from '../modal-user-location-creation/modal-user-location-creation';

@Component({
  selector: 'modal-user-location-list',
  templateUrl: 'modal-user-location-list.html'
})
export class ModalUserLocationListComponent {

  public userLocations: UserLocation[];

  public editing = {};

  public mapOptions: MapOptions = {
    maxZoom: 18,
    dragging: false
  }

  constructor(
    private userLocationProvider: UserLocationListProvider,
    private viewCtrl: ViewController,
    protected modalCtrl: ModalController
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

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  private setLocations() {
    this.userLocationProvider.getUserLocations().subscribe(res => this.userLocations = res);
  }

}
