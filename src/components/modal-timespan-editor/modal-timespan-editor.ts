import { NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Timespan } from 'helgoland-toolbox';

@Component({
  selector: 'modal-timespan-editor',
  templateUrl: 'modal-timespan-editor.html'
})
export class ModalTimespanEditorComponent {

  public start: string;
  public end: string;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) {
    const timespan = this.navParams.get('timespan') as Timespan;
    this.start = new Date(timespan.from).toISOString();
    this.end = new Date(timespan.to).toISOString();
  }

  public onTimespanSelected(timespan: Timespan) {
    this.viewCtrl.dismiss(timespan);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public confirmTimespan() {
    this.viewCtrl.dismiss(new Timespan(new Date(this.start).getTime(), new Date(this.end).getTime()));
  }

}
