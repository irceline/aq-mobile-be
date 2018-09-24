import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { UserLocation } from '../../providers/user-location-list/user-location-list';
import { Point } from 'geojson';

@Component({
  selector: 'modal-edit-user-location',
  templateUrl: 'modal-edit-user-location.html'
})
export class ModalEditUserLocationComponent {

  public userLocation: UserLocation;

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
  }

  public onLocationChanged(point: Point) {
    this.userLocation.point = point;
  }

  public updateLocation() {
    this.userLocation.label = this.label;
    this.viewCtrl.dismiss(this.userLocation);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
