import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UserLocationListService } from '../../../services/user-location-list/user-location-list.service';
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

  public nearestSeriesByDefault: boolean;

  constructor(
    protected modalCtrl: ModalController,
    // protected locatedTsSrvc: LocatedTimeseriesService,
    protected userLocationListProvider: UserLocationListService
  ) {
    // this.nearestSeriesByDefault = this.locatedTsSrvc.getShowNearestSeriesByDefault();
  }

  public createNewLocation() {
    this.modalCtrl.create({ component: ModalUserLocationCreationComponent }).then(modal => modal.present());
  }

  public showLocationList() {
    this.modalCtrl.create({ component: ModalUserLocationListComponent }).then(modal => modal.present());
  }

  // public toggleNearestSeries() {
  //   this.locatedTsSrvc.setShowNearestSeriesByDefault(this.nearestSeriesByDefault);
  // }

}
