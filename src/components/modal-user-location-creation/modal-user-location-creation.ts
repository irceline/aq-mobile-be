import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-user-location-creation',
  templateUrl: 'modal-user-location-creation.html'
})
export class ModalUserLocationCreationComponent {

  constructor(
    private viewCtrl: ViewController
  ) { }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
