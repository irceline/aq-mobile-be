import { Injectable } from '@angular/core';
import { DatasetOptions, DatasetService, Time, Timespan } from '@helgoland/core';
import { Observable, ReplaySubject } from 'rxjs';

const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable()
export class TimeseriesService extends DatasetService<DatasetOptions>{

    private timespan: ReplaySubject<Timespan> = new ReplaySubject();

    constructor(
        protected timeSrvc: Time,
    ) {
        super();
        this.loadTime();
        this.timespan.subscribe(timespan => this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, timespan));
    }

    public setTimespan(timespan: Timespan) {
        this.timespan.next(timespan);
    }

    public getTimespan(): Observable<Timespan> {
        return this.timespan.asObservable();
    }

    protected loadTime(): void {
        this.setTimespan(this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) || this.timeSrvc.initTimespan());
    }


    protected createStyles(internalId: string): DatasetOptions {
        throw new Error("Method not implemented.");
    }

    protected saveState(): void { }

    protected loadState(): void { }

}
