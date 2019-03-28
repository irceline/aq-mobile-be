import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { LocateService, LocationStatus } from '../../../services/locate/locate.service';
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
export class UserLocationsSettingsComponent implements OnInit {

  public locations: UserLocation[];

  public showCurrentLocation: boolean;

  constructor(
    protected modalCtrl: ModalController,
    protected userLocationService: UserLocationListService,
    private locate: LocateService,
    private toast: ToastController
  ) {
    this.setLocations();
  }

  public ngOnInit(): void {
    this.showCurrentLocation = this.userLocationService.isCurrentLocationVisible();
  }

  public createNewLocation() {
    this.modalCtrl.create({ component: ModalUserLocationCreationComponent }).then(modal => modal.present());
  }

  public showLocationList() {
    this.modalCtrl.create({ component: ModalUserLocationListComponent }).then(modal => modal.present());
  }

  private setLocations() {
    this.locations = this.userLocationService.getUserLocations();
  }

  public removeLocation(location: UserLocation) {
    this.userLocationService.removeLocation(location);
    this.setLocations();
  }

  public reorderItems(event) {
    const element = this.locations[event.detail.from];
    this.locations.splice(event.detail.from, 1);
    this.locations.splice(event.detail.to, 0, element);

    this.userLocationService.setLocationList(this.locations);
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
        this.userLocationService.saveLocation(res.data);
      }
    });
    modal.present();
  }

  public changeCurrentLocation(newVal) {
    if (newVal) {
      if (this.locate.getLocationStatus() === LocationStatus.DENIED) {
        this.locate.askForPermission()
          .then(permission => {
            if (permission) {
              this.updateShowCurrentLocation(true);
            } else {
              this.showCurrentLocation = false;
            }
          })
          .catch(error => this.presentError(error));
      } else {
        this.updateShowCurrentLocation(true);
      }
    } else {
      this.updateShowCurrentLocation(false);
    }
  }

  private presentError(error: any) {
    this.toast.create({ message: `Error occured: ${JSON.stringify(error)}`, duration: 3000 }).then(toast => toast.present());
  }

  private updateShowCurrentLocation(value: boolean) {
    this.userLocationService.setCurrentLocationVisisble(value);
    this.showCurrentLocation = value;
  }

}
