import { Component } from '@angular/core';
import { IonToggle, ModalController } from '@ionic/angular';
import { Point } from 'geojson';

import { UserLocation, UserLocationListService } from '../../../services/user-location-list/user-location-list.service';
import { ModalEditUserLocationComponent } from '../../modal-edit-user-location/modal-edit-user-location.component';
import {
  ModalUserLocationCreationComponent,
} from '../../modal-user-location-creation/modal-user-location-creation.component';
import { ModalUserLocationListComponent } from '../../modal-user-location-list/modal-user-location-list.component';

@Component({
  selector: 'user-locations-settings',
  templateUrl: './user-locations-settings.component.html',
  styleUrls: ['./user-locations-settings.component.scss'],
})
export class UserLocationsSettingsComponent {

  public locations: UserLocation[];

  public currentLocationActive: boolean;

  public points: Point[] = [];

  constructor(
    protected modalCtrl: ModalController,
    protected userLocationListProvider: UserLocationListService
  ) {
    this.setLocations();
    this.currentLocationActive = this.userLocationListProvider.isCurrentLocationVisible();
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
        this.userLocationListProvider.saveLocation(res.data);
      }
    });
    modal.present();
  }

  public toggleShowCurrentLocation(toggle: CustomEvent<IonToggle>) {
    this.userLocationListProvider.setCurrentLocationVisisble(toggle.detail.checked);
  }

}
