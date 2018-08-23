import { Injectable } from '@angular/core';
import { ColorService, DatasetOptions, DatasetService, LocalStorage, Time, Timespan } from '@helgoland/core';
import { Observable, ReplaySubject } from 'rxjs';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';
const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable()
export class TimeseriesService extends DatasetService<DatasetOptions> {

  private timespan: ReplaySubject<Timespan> = new ReplaySubject();

  constructor(
    protected localStorage: LocalStorage,
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
    return options;
  }

  public setTimespan(timespan: Timespan) {
    this.timespan.next(timespan);
  }

  public getTimespan(): Observable<Timespan> {
    return this.timespan.asObservable();
  }

  protected saveState(): void {
    this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
    this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  }

  protected loadState(): void {
    const options = this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM) || [];
    options.forEach(e => this.datasetOptions.set(e.internalId, e));
    this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM) || [];
    this.setTimespan(this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) || this.timeSrvc.initTimespan());
  }

}
