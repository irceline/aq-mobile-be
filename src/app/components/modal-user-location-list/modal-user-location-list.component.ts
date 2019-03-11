import { Component } from '@angular/core';
import { IonToggle, ModalController } from '@ionic/angular';
import { Point } from 'geojson';
import { MapOptions } from 'leaflet';

import { UserLocation, UserLocationListService } from '../../services/user-location-list/user-location-list.service';
import { ModalEditUserLocationComponent } from '../modal-edit-user-location/modal-edit-user-location.component';
import { ModalUserLocationCreationComponent } from '../modal-user-location-creation/modal-user-location-creation.component';

@Component({
  selector: 'modal-user-location-list',
  templateUrl: './modal-user-location-list.component.html',
  styleUrls: ['./modal-user-location-list.component.scss'],
})
export class ModalUserLocationListComponent {

  public locations: UserLocation[];

  public points: Point[] = [];

  public showCurrentLocation: boolean;

  public reorder = false;

  public editing = {};

  public mapOptions: MapOptions = {
    maxZoom: 18,
    dragging: false
  };

  constructor(
    private userLocationService: UserLocationListService,
    protected modalCtrl: ModalController
  ) {
    this.setLocations();
  }

  public dismiss() {
    this.userLocationService.setLocationList(this.locations);
    this.modalCtrl.dismiss();
  }

  public removeLocation(location: UserLocation) {
    this.userLocationService.removeLocation(location);
    this.setLocations();
  }

  public reorderItems(indexes) {
    const element = this.locations[indexes.from];
    this.locations.splice(indexes.from, 1);
    this.locations.splice(indexes.to, 0, element);

    const point = this.points[indexes.from];
    this.points.splice(indexes.from, 1);
    this.points.splice(indexes.to, 0, point);
  }

  public async editLocation(location: UserLocation) {
    const modal = await this.modalCtrl.create({
      component: ModalEditUserLocationComponent,
      componentProps: {
        userlocation: location
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data) {
        this.userLocationService.saveLocation(res.data);
      }
    });
    modal.present();
  }

  public createNewLocation() {
    this.modalCtrl.create({ component: ModalUserLocationCreationComponent }).then(modal => modal.present());
  }

  public toggleReorder() {
    this.reorder = !this.reorder;
  }

  public createPoint(location: UserLocation): Point {
    return {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    };
  }

  public toggleShowCurrentLocation(toggle: CustomEvent<IonToggle>) {
    this.userLocationService.setCurrentLocationVisisble(toggle.detail.checked);
  }

  private setLocations() {
    this.points = [];
    this.locations = this.userLocationService.getUserLocations();
    this.locations.forEach(e => this.points.push(this.createPoint(e)));
    this.showCurrentLocation = this.userLocationService.isCurrentLocationVisible();
  }

}
