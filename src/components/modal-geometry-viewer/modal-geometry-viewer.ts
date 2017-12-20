import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-geometry-viewer',
  templateUrl: 'modal-geometry-viewer.html'
})
export class ModalGeometryViewerComponent {

  public geometry: GeoJSON.GeoJsonObject;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.geometry = this.params.get('geometry');
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
