import { Component } from '@angular/core';
import { Point } from 'geojson';
import { ModalController, ViewController } from 'ionic-angular';
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
    const idx = this.locations.findIndex(e => e.type === 'current');
    this.userLocationProvider.setCurrentLocationIndex(idx);
    this.userLocationProvider.setShowCurrentLocation(this.showCurrentLocation);
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
    const modal = this.modalCtrl.create(ModalEditUserLocationComponent, { userlocation: location });
    modal.onDidDismiss(location => this.userLocationProvider.saveLocation(location));
    modal.present();
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

  public createPoint(location: UserLocation): Point {
    return {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    }
  }

  private setLocations() {
    this.userLocationProvider.getAllLocationsForEdit().subscribe(res => {
      this.locations = res;
      this.locations.forEach(e => this.points.push(this.createPoint(e)));
    });
    this.userLocationProvider.getLocationSettings().subscribe(settings => this.showCurrentLocation = settings.showCurrentLocation);
  }

}
