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

  public locations: UserLocation[];

  public reorder: boolean = false;

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
    const idx = this.locations.findIndex(e => e.type === 'current');
    this.userLocationProvider.setCurrentLocationIndex(idx);
    this.locations.splice(idx, 1);
    this.userLocationProvider.setUserLocations(this.locations);
    this.viewCtrl.dismiss();
  }

  public removeLocation(location: UserLocation) {
    this.userLocationProvider.removeLocation(location);
    this.setLocations();
  }

  public reorderItems(indexes) {
    let element = this.locations[indexes.from];
    this.locations.splice(indexes.from, 1);
    this.locations.splice(indexes.to, 0, element);
  }

  public editLocation(location: UserLocation) {
    debugger;
  }

  public saveLocation(location: UserLocation) {
    this.userLocationProvider.saveLocation(location);
  }

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  public toggleReorder() {
    this.reorder = !this.reorder;
  }

  private setLocations() {
    this.userLocationProvider.getAllLocations().subscribe(res => this.locations = res);
  }

}
