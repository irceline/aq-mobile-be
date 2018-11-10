import { Component } from '@angular/core';
import { Point } from 'geojson';
import { ModalController, Toggle, ViewController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { UserLocation, UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { ModalEditUserLocationComponent } from '../modal-edit-user-location/modal-edit-user-location';
import { ModalUserLocationCreationComponent } from '../modal-user-location-creation/modal-user-location-creation';

@Component({
  selector: 'modal-user-location-list',
  templateUrl: 'modal-user-location-list.html'
})
export class ModalUserLocationListComponent {

  public locations: UserLocation[];

  public points: Point[] = [];

  public showCurrentLocation: boolean;

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
    this.userLocationProvider.setLocationList(this.locations);
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

    let point = this.points[indexes.from];
    this.points.splice(indexes.from, 1);
    this.points.splice(indexes.to, 0, point);
  }

  public editLocation(location: UserLocation) {
    const modal = this.modalCtrl.create(ModalEditUserLocationComponent, { userlocation: location });
    modal.onDidDismiss(location => this.userLocationProvider.saveLocation(location));
    modal.present();
  }

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  public toggleReorder() {
    this.reorder = !this.reorder;
  }

  public createPoint(location: UserLocation): Point {
    return {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    }
  }

  public toggleShowCurrentLocation(toggle: Toggle) {
    this.userLocationProvider.setCurrentLocationVisisble(toggle.value);
  }

  private setLocations() {
    this.userLocationProvider.getUserLocations().subscribe(res => {
      this.locations = res;
      this.locations.forEach(e => this.points.push(this.createPoint(e)));
    });
    this.userLocationProvider.isCurrentLocationVisible().subscribe(vis => this.showCurrentLocation = vis);
  }

}
