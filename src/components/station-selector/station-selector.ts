import { Component } from '@angular/core';
import { ColorService, Dataset, Station } from '@helgoland/core';
import { NavParams, ViewController } from 'ionic-angular';

import { UserTimeseriesService } from '../../providers/timeseries/user-timeseries';

@Component({
  selector: 'station-selector',
  templateUrl: 'station-selector.html'
})
export class StationSelectorComponent {

  public station: Station;
  public providerUrl: string;
  public phenomenonId: string;

  public datasetSelections: Array<Dataset> = [];

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public tsSrvc: UserTimeseriesService,
    public colorSrvc: ColorService
  ) {
    this.station = this.params.get('platform');
    this.providerUrl = this.params.get('providerUrl');
    this.phenomenonId = this.params.get('phenomenonId');
  }

  public onDatasetSelectionChanged(datasets: Dataset[]) {
    this.datasetSelections = datasets;
  }

  public confirmSelection() {
    this.datasetSelections.forEach(entry => {
      this.tsSrvc.addDataset(entry.internalId);
    });
    this.viewCtrl.dismiss(true);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
