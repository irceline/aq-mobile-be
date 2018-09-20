import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import {
    ModalUserLocationCreationComponent,
} from '../../../components/modal-user-location-creation/modal-user-location-creation';
import { ModalUserLocationListComponent } from '../../../components/modal-user-location-list/modal-user-location-list';
import { LocatedTimeseriesService } from '../../../providers/timeseries/located-timeseries';

@Component({
  selector: 'user-locations-settings',
  templateUrl: 'user-locations-settings.html'
})
export class UserLocationsSettingsComponent {

  public nearestSeriesByDefault: boolean;

  constructor(
    protected modalCtrl: ModalController,
    protected locatedTsSrvc: LocatedTimeseriesService
  ) {
    this.nearestSeriesByDefault = this.locatedTsSrvc.getShowNearestSeriesByDefault();
  }

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  public showLocationList() {
    this.modalCtrl.create(ModalUserLocationListComponent).present();
  }

  public toggleNearestSeries() {
    this.locatedTsSrvc.setShowNearestSeriesByDefault(this.nearestSeriesByDefault);
  }


}
