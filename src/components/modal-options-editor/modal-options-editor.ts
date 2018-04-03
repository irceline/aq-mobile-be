import { Component } from '@angular/core';
import { DatasetOptions } from '@helgoland/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-options-editor',
  templateUrl: 'modal-options-editor.html'
})
export class ModalOptionsEditorComponent {

  private options: DatasetOptions;

  public color: string;
  public generalize: boolean;
  public zeroBasedYAxe: boolean;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) {
    this.options = this.navParams.get('options');
    this.color = this.options.color;
    this.generalize = this.options.generalize;
    this.zeroBasedYAxe = this.options.zeroBasedYAxe;
  }

  public updateOption() {
    if (this.color) this.options.color = this.color;
    this.options.generalize = this.generalize;
    this.options.zeroBasedYAxe = this.zeroBasedYAxe;
    this.viewCtrl.dismiss(this.options);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
