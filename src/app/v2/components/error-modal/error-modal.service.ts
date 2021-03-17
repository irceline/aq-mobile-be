import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ErrorModalComponent } from './error-modal.component';

export enum ErrorType {
  NO_NETWORK = 'NO_NETWORK',
  NO_IRCELINE_SETTINGS = 'NO_IRCELINE_SETTINGS'
}

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {

  private isOpen: boolean;

  constructor(
    private modalController: ModalController
  ) { }

  public openErrorModal(error: ErrorType) {
    if (!this.isOpen) {
      this.isOpen = true;
      const modal = this.modalController.create({
        component: ErrorModalComponent,
        componentProps: { errorType: error }
      }).then(modal => {
        modal.present();
        modal.onDidDismiss().then(dismissed => this.isOpen = false)
      });
    }
  }
}
