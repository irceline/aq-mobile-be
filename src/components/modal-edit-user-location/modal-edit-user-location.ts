import { Component } from '@angular/core';
import { Point } from 'geojson';
import { NavParams, ViewController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { UserLocation } from '../../providers/user-location-list/user-location-list';

@Component({
  selector: 'modal-edit-user-location',
  templateUrl: 'modal-edit-user-location.html'
})
export class ModalEditUserLocationComponent {

  public userLocation: UserLocation;

  public point: Point;

  public label: string;

  public mapOptions: MapOptions = {
    maxZoom: 18,
    dragging: true
  }

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.userLocation = this.params.get('userlocation');
    this.label = this.userLocation.label;
    this.point = { type: 'Point', coordinates: [this.userLocation.longitude, this.userLocation.latitude] };
  }

  public onLocationChanged(point: Point) {
    this.userLocation.latitude = point.coordinates[1];
    this.userLocation.longitude = point.coordinates[0];
  }

  public updateLocation() {
    this.userLocation.label = this.label;
    this.viewCtrl.dismiss(this.userLocation);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
