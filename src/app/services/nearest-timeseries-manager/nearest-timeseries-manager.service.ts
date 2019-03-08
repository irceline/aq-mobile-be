import { Injectable } from '@angular/core';
import { forkJoin, Observable, Observer } from 'rxjs';

import { getIDForMainPhenomenon, MainPhenomenon } from '../../model/phenomenon';
import { NearestTimeseriesService } from '../nearest-timeseries/nearest-timeseries.service';
import { UserLocation } from '../user-location-list/user-location-list.service';

@Injectable()
export class NearestTimeseriesManagerService {

  private nearestTimeseriesMap: Map<string, Map<string, string>> = new Map();

  private currentLocationTimeseries: Map<string, string> = new Map();

  constructor(
    private nearestTimeseries: NearestTimeseriesService
  ) { }

  public getNearestTimeseries(location: UserLocation): Observable<string[]> {
    return new Observable<string[]>((observer: Observer<string[]>) => {
      if (location.type === 'user') {
        if (this.nearestTimeseriesMap.get(location.label)) {
          observer.next(Array.from(this.nearestTimeseriesMap.get(location.label).values()));
          observer.complete();
        } else {
          forkJoin(
            this.nearestTimeseries
              .determineNextTimeseries(location.latitude, location.longitude, getIDForMainPhenomenon(MainPhenomenon.BC)),
            this.nearestTimeseries
              .determineNextTimeseries(location.latitude, location.longitude, getIDForMainPhenomenon(MainPhenomenon.NO2)),
            this.nearestTimeseries
              .determineNextTimeseries(location.latitude, location.longitude, getIDForMainPhenomenon(MainPhenomenon.O3)),
            this.nearestTimeseries
              .determineNextTimeseries(location.latitude, location.longitude, getIDForMainPhenomenon(MainPhenomenon.PM10)),
            this.nearestTimeseries
              .determineNextTimeseries(location.latitude, location.longitude, getIDForMainPhenomenon(MainPhenomenon.PM25))
          ).subscribe(res => {
            const list = [];
            res.forEach(e => {
              list.push(e.series.internalId);
              this.setNearestTimeseries(location, e.series.parameters.phenomenon.id, e.series.internalId);
            });
            observer.next(list);
            observer.complete();
          });
        }
      } else if (location.type === 'current') {
        observer.next(Array.from(this.currentLocationTimeseries.values()));
        observer.complete();
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  public setNearestTimeseries(location: UserLocation, phenomenonId: string, seriesId: string) {
    if (location.type === 'user') {
      if (!this.nearestTimeseriesMap.has(location.label)) {
        this.nearestTimeseriesMap.set(location.label, new Map());
      }
      this.nearestTimeseriesMap.get(location.label).set(phenomenonId, seriesId);
    }
    if (location.type === 'current') {
      this.currentLocationTimeseries.set(phenomenonId, seriesId);
    }
  }

}
