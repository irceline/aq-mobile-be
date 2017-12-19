import { Component } from '@angular/core';
import { ColorService, Dataset, DatasetOptions, Platform } from 'helgoland-toolbox';
import { NavParams, ViewController } from 'ionic-angular';

// import { TimeseriesService } from '../../timeseries.service';

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
    // public timeseriesSrvc: TimeseriesService,
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
      const option = new DatasetOptions(entry.internalId, this.colorSrvc.getColor());
      option.generalize = true;
      // this.timeseriesSrvc.addDataset(entry.internalId, option);
    });
    this.viewCtrl.dismiss(true);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
