import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ModalUserLocationCreationComponent } from '../modal-user-location-creation/modal-user-location-creation.component';
import { ModalSettingsComponent } from '../settings/modal-settings/modal-settings.component';

@Component({
  selector: 'last-slide',
  templateUrl: './last-slide.component.html',
  styleUrls: ['./last-slide.component.scss'],
})
export class LastSlideComponent {

  constructor(
    private modalCtrl: ModalController
  ) { }

  public navigateSettings() {
    this.modalCtrl.create({ component: ModalSettingsComponent }).then(modal => modal.present());
  }

  public createNewLocation() {
    this.modalCtrl.create({ component: ModalUserLocationCreationComponent }).then(modal => modal.present());
  }

}
