import { Component } from '@angular/core';
import { Phenomenon, SettingsService } from '@helgoland/core';
import { NavParams, ViewController } from 'ionic-angular';

import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'modal-phenomenon-selector',
  templateUrl: 'modal-phenomenon-selector.html'
})
export class ModalPhenomenonSelectorComponent {

  public providerUrl: string;
  public selectedPhenomenonId: string;
  public hiddenPhenomenonIDs: string[];

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public settings: SettingsService<MobileSettings>
  ) {
    this.providerUrl = this.params.get('providerUrl');
    this.selectedPhenomenonId = this.params.get('selectedPhenomenonId');
    this.hiddenPhenomenonIDs = this.params.get('hiddenPhenomenonIDs');
  }

  public onPhenomenonSelected(phenomenon: Phenomenon) {
    this.viewCtrl.dismiss(phenomenon);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
