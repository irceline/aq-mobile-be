import { Component } from '@angular/core';
import { ColorService, Dataset, Platform } from '@helgoland/core';
import { NavParams, ViewController } from 'ionic-angular';

import { TimeseriesService } from '../../providers/timeseries/timeseries.service';

@Component({
  selector: 'station-selector',
  templateUrl: 'station-selector.html'
})
export class StationSelectorComponent {

  public platform: Platform;
  public providerUrl: string;

  public datasetSelections: Array<Dataset> = [];

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public timeseriesSrvc: TimeseriesService,
    public colorSrvc: ColorService
  ) {
    this.platform = this.params.get('platform');
    this.providerUrl = this.params.get('providerUrl');
  }

  public onDatasetSelectionChanged(datasets: Dataset[]) {
    this.datasetSelections = datasets;
  }

  public confirmSelection() {
    this.datasetSelections.forEach(entry => {
      this.timeseriesSrvc.addDataset(entry.internalId);
    });
    this.viewCtrl.dismiss(true);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
