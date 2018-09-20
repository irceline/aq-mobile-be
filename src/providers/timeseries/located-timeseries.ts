import { Injectable } from '@angular/core';
import { ColorService, DatasetOptions, DatasetService } from '@helgoland/core';

import { TimeseriesService } from './timeseries';

@Injectable()
export class LocatedTimeseriesService extends DatasetService<DatasetOptions> {

  private selectedIndex: number;

  constructor(
    private color: ColorService,
    private tsSrvc: TimeseriesService
  ) {
    super();
  }

  removeAllDatasets() {
    this.datasetIds.forEach(id => this.tsSrvc.removeDataset(id));
    super.removeAllDatasets();
  }

  addDataset(internalId: string, options?: DatasetOptions) {
    super.addDataset(internalId, options);
    this.tsSrvc.addDataset(internalId, this.datasetOptions.get(internalId));
  }

  public setSelectedIndex(idx: number) {
    this.selectedIndex = idx;
  }

  public getSelectedIndex(): number {
    return this.selectedIndex;
  }

  protected createStyles(internalId: string): DatasetOptions {
    const options = new DatasetOptions(internalId, this.color.getColor());
    options.pointRadius = 2;
    options.generalize = false;
    options.zeroBasedYAxis = true;
    return options;
  }

  protected saveState(): void { }

  protected loadState(): void { }

}
