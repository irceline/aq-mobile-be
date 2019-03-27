import { Component } from '@angular/core';
import { IonToggle, ModalController } from '@ionic/angular';
import { Point } from 'geojson';

import { UserLocation, UserLocationListService } from '../../../services/user-location-list/user-location-list.service';
import {
  ModalUserLocationCreationComponent,
} from '../../modal-user-location-creation/modal-user-location-creation.component';
import { ModalUserLocationListComponent } from '../../modal-user-location-list/modal-user-location-list.component';
import { ModalEditUserLocationComponent } from '../../modal-edit-user-location/modal-edit-user-location.component';

@Component({
  selector: 'user-locations-settings',
  templateUrl: './user-locations-settings.component.html',
  styleUrls: ['./user-locations-settings.component.scss'],
})
export class UserLocationsSettingsComponent {

  public locations: UserLocation[];

  public points: Point[] = [];

  constructor(
    protected modalCtrl: ModalController,
    protected userLocationListProvider: UserLocationListService
  ) {
    this.setLocations();
  }

  public createNewLocation() {
    this.modalCtrl.create({ component: ModalUserLocationCreationComponent }).then(modal => modal.present());
  }

  public showLocationList() {
    this.modalCtrl.create({ component: ModalUserLocationListComponent }).then(modal => modal.present());
  }

  private setLocations() {
    this.points = [];
    this.locations = this.userLocationListProvider.getUserLocations();
  }

  public removeLocation(location: UserLocation) {
    this.userLocationListProvider.removeLocation(location);
    this.setLocations();
  }

  public reorderItems(event) {
    const element = this.locations[event.detail.from];
    this.locations.splice(event.detail.from, 1);
    this.locations.splice(event.detail.to, 0, element);

    const point = this.points[event.detail.from];
    this.points.splice(event.detail.from, 1);
    this.points.splice(event.detail.to, 0, point);

    event.detail.complete(true);
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
        this.userLocationListProvider.saveLocation(res.data);
      }
    });
    modal.present();
  }

  public toggleShowCurrentLocation(toggle: CustomEvent<IonToggle>) {
    this.userLocationListProvider.setCurrentLocationVisisble(toggle.detail.checked);
  }

}
