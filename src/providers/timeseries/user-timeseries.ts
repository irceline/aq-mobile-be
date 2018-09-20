import { Injectable } from '@angular/core';
import { ColorService, DatasetOptions, DatasetService, Time } from '@helgoland/core';
import { Storage } from '@ionic/storage';

import { TimeseriesService } from './timeseries';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';

@Injectable()
export class UserTimeseriesService extends DatasetService<DatasetOptions> {

  constructor(
    private storage: Storage,
    protected timeSrvc: Time,
    private color: ColorService,
    private tsSrvc: TimeseriesService
  ) {
    super();
    this.loadState();
  }

  addDataset(internalId: string, options?: DatasetOptions): void {
    super.addDataset(internalId, options);
    this.tsSrvc.addDataset(internalId, this.datasetOptions.get(internalId));
  }

  removeDataset(internalId: string): void {
    this.tsSrvc.removeDataset(internalId);
    super.removeDataset(internalId);
  }

  hasDatasets(): boolean {
    return super.hasDatasets();
  }

  updateDatasetOptions(options: DatasetOptions, internalId: string): void {
    super.updateDatasetOptions(options, internalId);
    this.tsSrvc.updateDatasetOptions(options, internalId);
  }

  protected createStyles(internalId: string) {
    const options = new DatasetOptions(internalId, this.color.getColor());
    options.pointRadius = 2;
    options.generalize = false;
    options.zeroBasedYAxis = true;
    return options;
  }

  protected saveState(): void {
    this.storage.set(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
    this.storage.set(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  }

  protected loadState(): void {
    const optionsPromise = this.storage.get(TIMESERIES_OPTIONS_CACHE_PARAM)
      .then(res => {
        const options = res ? res : [];
        options.forEach(e => this.datasetOptions.set(e.internalId, e));
      })
    const idsPromise = this.storage.get(TIMESERIES_IDS_CACHE_PARAM)
      .then(res => this.datasetIds = res ? res : [])

    Promise.all([optionsPromise, idsPromise]).then(res => {
      this.datasetIds.forEach(id => this.tsSrvc.addDataset(id, this.datasetOptions.get(id)))
    })
  }

}
