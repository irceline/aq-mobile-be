import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'modal-user-location-creation',
  templateUrl: './modal-user-location-creation.component.html',
  styleUrls: ['./modal-user-location-creation.component.scss'],
})
export class ModalUserLocationCreationComponent {

  constructor(
    private modalCtrl: ModalController
  ) { }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
