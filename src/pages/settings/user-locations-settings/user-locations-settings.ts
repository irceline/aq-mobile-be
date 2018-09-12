import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import {
  ModalUserLocationCreationComponent,
} from '../../../components/modal-user-location-creation/modal-user-location-creation';
import { ModalUserLocationListComponent } from '../../../components/modal-user-location-list/modal-user-location-list';

@Component({
  selector: 'user-locations-settings',
  templateUrl: 'user-locations-settings.html'
})
export class UserLocationsSettingsComponent {

  constructor(
    protected modalCtrl: ModalController
  ) {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  public showLocationList() {
    this.modalCtrl.create(ModalUserLocationListComponent).present();
  }

}
