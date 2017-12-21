import { Component } from '@angular/core';
import { SettingsService } from 'helgoland-toolbox';
import { Phenomenon } from 'helgoland-toolbox/dist/model/api/phenomenon';
import { NavParams, ViewController } from 'ionic-angular';

import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'phenomenon-selector-popover',
  templateUrl: 'phenomenon-selector-popover.html'
})
export class PhenomenonSelectorPopoverComponent {

  public providerUrl: string;
  public selectedPhenomenonId: string;
  public visiblePhenomenonIDs: string[];

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public settings: SettingsService<MobileSettings>
  ) {
    this.providerUrl = this.params.get('providerUrl');
    this.selectedPhenomenonId = this.params.get('selectedPhenomenonId');
    this.visiblePhenomenonIDs = this.settings.getSettings().visiblePhenomenonIDs;
  }

  public onPhenomenonSelected(phenomenon: Phenomenon) {
    this.viewCtrl.dismiss(phenomenon);
  }

  public listAllPhenomenons() {
    this.visiblePhenomenonIDs = null;
  }

  public hideSomePhenomenons() {
    this.visiblePhenomenonIDs = this.settings.getSettings().visiblePhenomenonIDs;
  }

}
