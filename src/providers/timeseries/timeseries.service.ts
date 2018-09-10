import { Injectable } from '@angular/core';
import { ColorService, DatasetOptions, DatasetService, Time, Timespan } from '@helgoland/core';
import { Storage } from '@ionic/storage';
import { Observable, ReplaySubject } from 'rxjs';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';
const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable()
export class TimeseriesService extends DatasetService<DatasetOptions> {

  private timespan: ReplaySubject<Timespan> = new ReplaySubject();

  constructor(
    private storage: Storage,
    protected timeSrvc: Time,
    private color: ColorService
  ) {
    super();
    this.loadState();
    this.timespan.subscribe(timespan => this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, timespan));
  }

  protected createStyles(internalId: string) {
    const options = new DatasetOptions(internalId, this.color.getColor());
    options.pointRadius = 2;
    options.generalize = false;
    options.zeroBasedYAxis = true;
    return options;
  }

  public setTimespan(timespan: Timespan) {
    this.timespan.next(timespan);
  }

  public getTimespan(): Observable<Timespan> {
    return this.timespan.asObservable();
  }

  protected saveState(): void {
    this.storage.set(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
    this.storage.set(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  }

  protected loadState(): void {
    this.storage.get(TIMESERIES_OPTIONS_CACHE_PARAM)
      .then(res => {
        const options = res ? res : [];
        options.forEach(e => this.datasetOptions.set(e.internalId, e));
      })
    this.storage.get(TIMESERIES_IDS_CACHE_PARAM)
      .then(res => this.datasetIds = res ? res : [])
    this.setTimespan(this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) || this.timeSrvc.initTimespan());
  }

}
