import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ModalAnnualMapComponent } from '../modal-annual-map/modal-annual-map';

@Component({
  selector: 'annual-phenomenon-buttons',
  templateUrl: 'annual-phenomenon-buttons.html'
})
export class AnnualPhenomenonButtonsComponent {

  constructor(
    private modalCtrl: ModalController
  ) { }

  public openMap(phenomenon: string) {
    this.modalCtrl.create(ModalAnnualMapComponent, { phenomenon }).present();
  }

}
