import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ErrorType } from './error-modal.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss', './error-modal.component.hc.scss'],
})
export class ErrorModalComponent {

  // @ts-ignore
  public errorType: ErrorType;

  constructor(
    private modalController: ModalController
  ) { }

  public close() {
    this.modalController.dismiss();
  }

}
