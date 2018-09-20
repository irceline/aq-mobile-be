import { Injectable } from '@angular/core';
import { ColorService, DatasetOptions, DatasetService, LocalStorage } from '@helgoland/core';

import { TimeseriesService } from './timeseries';

const LOCALSTORAGE_SHOW_DEFAULT_SERIES = 'located-timeseries.show-default.series';

@Injectable()
export class LocatedTimeseriesService extends DatasetService<DatasetOptions> {

  private selectedIndex: number;

  private showSeries;

  constructor(
    private color: ColorService,
    private tsSrvc: TimeseriesService,
    private storage: LocalStorage
  ) {
    super();
    this.showSeries = this.getShowNearestSeriesByDefault();
  }

  removeAllDatasets() {
    this.datasetIds.forEach(id => this.tsSrvc.removeDataset(id));
    super.removeAllDatasets();
  }

  addDataset(internalId: string, options?: DatasetOptions) {
    super.addDataset(internalId, options);
    this.tsSrvc.addDataset(internalId, this.datasetOptions.get(internalId));
  }

  public setShowNearestSeriesByDefault(nearestSeriesByDefault: boolean) {
    this.storage.save(LOCALSTORAGE_SHOW_DEFAULT_SERIES, nearestSeriesByDefault);
    this.showSeries = nearestSeriesByDefault;
  }

  public getShowNearestSeriesByDefault(): boolean {
    if (this.storage.load(LOCALSTORAGE_SHOW_DEFAULT_SERIES) != null) {
      return this.storage.load(LOCALSTORAGE_SHOW_DEFAULT_SERIES);
    } else {
      return true;
    }
  }

  public getShowSeries(): boolean {
    return this.showSeries;
  }

  public setShowSeries(showSeries: boolean) {
    this.showSeries = showSeries;
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
