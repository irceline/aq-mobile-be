import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Phenomenon } from 'helgoland-toolbox/dist/model/api/phenomenon';

@Component({
  selector: 'phenomenon-selector-popover',
  templateUrl: 'phenomenon-selector-popover.html'
})
export class PhenomenonSelectorPopoverComponent {

  public providerUrl: string;
  public selectedPhenomenonId: string;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    this.providerUrl = this.params.get('providerUrl');
    this.selectedPhenomenonId = this.params.get('selectedPhenomenonId');
  }

  public onPhenomenonSelected(phenomenon: Phenomenon) {
    this.viewCtrl.dismiss(phenomenon);
  }

}
