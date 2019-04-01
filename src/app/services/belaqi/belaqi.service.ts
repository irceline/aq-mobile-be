import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';
import moment from 'moment';
import { forkJoin, Observable, Observer, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { createCacheKey } from '../../model/caching';
import { MainPhenomenon } from '../../model/phenomenon';
import { CategorizedValueService } from '../categorized-value/categorized-value.service';
import { IrcelineSettingsService } from '../irceline-settings/irceline-settings.service';
import { ModelledValueService } from '../modelled-value/modelled-value.service';
import { ValueProvider } from '../value-provider';

export interface BelaqiTimelineEntry {
  timestamp: Date;
  index: number;
}

interface TrendResultEntry {
  o3: [Date, number][];
  pm10: [Date, number][];
  pm25: [Date, number][];
}

interface TrendResult {
  description: string;
  'lastupdate rioifdm': string;
  'lastupdate forecasts': string;
  'latest observations': TrendResultEntry;
  trend: TrendResultEntry;
}

const NO2_TREND_DAYS_CALCULATION = 3;

@Injectable()
export class BelaqiIndexService extends ValueProvider {

  private no2Trends = require('../../../assets/no2_trend.json');

  constructor(
    http: HttpClient,
    private modelledValueProvider: ModelledValueService,
    private categorizeValueToIndex: CategorizedValueService,
    private translate: TranslateService,
    private cacheService: CacheService,
    private ircelineSettings: IrcelineSettingsService
  ) {
    super(http);
  }

  public getValue(latitude: number, longitude: number, time?: Date): Observable<number> {
    return new Observable<number>((observer: Observer<number>) => {
      if (!time) {
        this.ircelineSettings.getSettings().subscribe(
          setts => {
            this.createValueRequest(latitude, longitude, setts.lastupdate).subscribe(
              val => observer.next(val),
              error => observer.error(error),
              () => observer.complete()
            );
          },
          error => {
            observer.error(error);
            observer.complete();
          }
        );
      } else {
        this.createValueRequest(latitude, longitude, time).subscribe(
          val => observer.next(val),
          error => observer.error(error),
          () => observer.complete()
        );
      }
    });
  }

  private createValueRequest(latitude: number, longitude: number, time: Date) {
    const url = 'http://geo5.irceline.be/rioifdm/belaqi/wms';
    const params = {
      request: 'GetFeatureInfo',
      bbox: this.calculateRequestBbox(latitude, longitude),
      service: 'WMS',
      info_format: 'application/json',
      query_layers: 'rioifdm:belaqi',
      layers: 'rioifdm:belaqi',
      width: '1',
      height: '1',
      srs: 'EPSG:4326',
      version: '1.1.1',
      X: '1',
      Y: '1'
    };
    const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(url, {
      responseType: 'json',
      params: params
    });
    params['time'] = time.toISOString();
    return this.cacheService.loadFromObservable(createCacheKey(url, params, time), request).pipe(map((res) => {
      if (res && res.features && res.features.length === 1) {
        if (res.features[0].properties['GRAY_INDEX']) {
          return res.features[0].properties['GRAY_INDEX'];
        }
      }
      return 0;
    }));
  }

  public getColorForIndex(index: number) {
    switch (index) {
      case 1: return '#0000FF';
      case 2: return '#0099FF';
      case 3: return '#009900';
      case 4: return '#00FF00';
      case 5: return '#FFFF00';
      case 6: return '#FFBB00';
      case 7: return '#FF6600';
      case 8: return '#FF0000';
      case 9: return '#990000';
      case 10: return '#660000';
      default: return null;
    }
  }

  public getValueForIndex(index: number) {
    switch (index) {
      case 1: return '1';
      case 2: return '2';
      case 3: return '3';
      case 4: return '4';
      case 5: return '5';
      case 6: return '6';
      case 7: return '7';
      case 8: return '8';
      case 9: return '9';
      case 10: return '10';
      default: return null;
    }
  }

  public getLabelForIndex(index: number) {
    switch (index) {
      case 1:
        return this.translate.instant('belaqi.level.excellent');
      case 2:
        return this.translate.instant('belaqi.level.very-good');
      case 3:
        return this.translate.instant('belaqi.level.good');
      case 4:
        return this.translate.instant('belaqi.level.fairly-good');
      case 5:
        return this.translate.instant('belaqi.level.moderate');
      case 6:
        return this.translate.instant('belaqi.level.poor');
      case 7:
        return this.translate.instant('belaqi.level.very-poor');
      case 8:
        return this.translate.instant('belaqi.level.bad');
      case 9:
        return this.translate.instant('belaqi.level.very-bad');
      case 10:
        return this.translate.instant('belaqi.level.horrible');
      default:
        return null;
    }
  }

  public getLabelForIndexSplit(index: number) {
    switch (index) {
      case 1:
        return this.translate.instant('belaqi.level-split.excellent');
      case 2:
        return this.translate.instant('belaqi.level-split.very-good');
      case 3:
        return this.translate.instant('belaqi.level-split.good');
      case 4:
        return this.translate.instant('belaqi.level-split.fairly-good');
      case 5:
        return this.translate.instant('belaqi.level-split.moderate');
      case 6:
        return this.translate.instant('belaqi.level-split.poor');
      case 7:
        return this.translate.instant('belaqi.level-split.very-poor');
      case 8:
        return this.translate.instant('belaqi.level-split.bad');
      case 9:
        return this.translate.instant('belaqi.level-split.very-bad');
      case 10:
        return this.translate.instant('belaqi.level-split.horrible');
      default:
        return null;
    }
  }

  public getTimeline(latitude: number, longitude: number, time: Date): Observable<BelaqiTimelineEntry[]> {
    return forkJoin([
      this.getPastTimeline(latitude, longitude, time),
      this.getFutureTimeline(latitude, longitude, time)
    ]).pipe(
      map(res => res[0].concat(res[1]))
    );
  }

  private getPastTimeline(
    latitude: number,
    longitude: number,
    time: Date
  ): Observable<BelaqiTimelineEntry[]> {
    const timestamps = [
      moment(time).subtract(11, 'hours').toDate(),
      moment(time).subtract(10, 'hours').toDate(),
      moment(time).subtract(9, 'hours').toDate(),
      moment(time).subtract(8, 'hours').toDate(),
      moment(time).subtract(7, 'hours').toDate(),
      moment(time).subtract(6, 'hours').toDate(),
      moment(time).subtract(5, 'hours').toDate(),
      moment(time).subtract(4, 'hours').toDate(),
      moment(time).subtract(3, 'hours').toDate(),
      moment(time).subtract(2, 'hours').toDate(),
      moment(time).subtract(1, 'hours').toDate(),
      time
    ];
    return forkJoin(
      timestamps.map(ts => this.getValue(latitude, longitude, ts).pipe(map(res => res), catchError(() => of(null))))
    ).pipe(
      map(res => {
        const timelineEntries: BelaqiTimelineEntry[] = [];
        res.forEach((e, i) => {
          timelineEntries.push({
            timestamp: timestamps[i],
            index: e
          });
        });
        return timelineEntries;
      })
    );
  }

  private getFutureTimeline(latitude: number, longitude: number, time: Date): Observable<BelaqiTimelineEntry[]> {
    return new Observable((observer: Observer<BelaqiTimelineEntry[]>) => {
      this.getTrends().subscribe(trend => {
        forkJoin([
          this.createFuturePhenomenonTimeline(latitude, longitude, time, MainPhenomenon.O3, trend.trend.o3),
          this.createFuturePhenomenonTimeline(latitude, longitude, time, MainPhenomenon.PM10, trend.trend.pm10),
          this.createFuturePhenomenonTimeline(latitude, longitude, time, MainPhenomenon.PM25, trend.trend.pm25),
          this.createFuturePhenomenonTimelineForNO2(latitude, longitude, time)
        ]).pipe(map(forecasts => {
          // find the max of each entry
          return forecasts[0].map((entry, i) => {
            return {
              timestamp: entry.timestamp,
              index: Math.max(...forecasts.map(e => e[i] ? e[i].index : 0))
            };
          });
        })).subscribe(res => {
          observer.next(res);
          observer.complete();
        }, error => {
          observer.error(error);
          observer.complete();
        });
      });
    });
  }

  private createFuturePhenomenonTimelineForNO2(
    latitude: number,
    longitude: number,
    time: Date
  ): Observable<BelaqiTimelineEntry[]> {
    const phenomenon = MainPhenomenon.NO2;
    return this.modelledValueProvider.getValue(latitude, longitude, time, phenomenon).pipe(
      map(currentValue => {
        const timelineEntries: BelaqiTimelineEntry[] = [];
        const hour = time.getUTCHours();
        const trend = this.no2Trends[hour];
        for (let day = 0; day < NO2_TREND_DAYS_CALCULATION; day++) {
          trend.forEach((e, i) => {
            timelineEntries.push({
              timestamp: moment(time).add(i + 1, 'hours').toDate(),
              index: this.categorizeValueToIndex.categorize(currentValue * e, phenomenon)
            });
          });
        }
        return timelineEntries;
      })
    );
  }

  private createFuturePhenomenonTimeline(
    latitude: number,
    longitude: number,
    time: Date,
    phenomenon: MainPhenomenon,
    trend: [Date, number][]
  ): Observable<BelaqiTimelineEntry[]> {
    return this.modelledValueProvider.getValue(latitude, longitude, time, phenomenon).pipe(
      map(currentValue => {
        // map results to timeline entries
        const timelineEntries: BelaqiTimelineEntry[] = [];
        // calculate the new values and add them to the timeline entries
        let nextHour = moment(time).add(1, 'hours').toDate();
        let nextTrend = this.findMatchingTime(trend, nextHour);
        while (nextTrend) {
          const nextValue = currentValue * nextTrend;
          timelineEntries.push({
            timestamp: nextHour,
            index: this.categorizeValueToIndex.categorize(nextValue, phenomenon)
          });
          nextHour = moment(nextHour).add(1, 'hours').toDate();
          nextTrend = this.findMatchingTime(trend, nextHour);
        }
        return timelineEntries;
      })
    );
  }

  private getTrends(): Observable<TrendResult> {
    // const trendUrl = 'https://www.irceline.be/tables/forecast/model/trend.php';
    const trendUrl = 'https://www.irceline.be/air/forecast/trend.php';
    return new Observable((observer: Observer<TrendResult>) => {
      this.ircelineSettings.getSettings().subscribe(settings => {
        const request = this.http.get<TrendResult>(trendUrl);
        const cacheKey = createCacheKey(trendUrl, null, settings.lastupdate);
        this.cacheService.loadFromObservable(cacheKey, request).subscribe(
          res => {
            // res['latest observations'].o3.forEach(e => e[0] = moment(e[0]).toDate());
            // res['latest observations'].pm10.forEach(e => e[0] = moment(e[0]).toDate());
            // res['latest observations'].pm25.forEach(e => e[0] = moment(e[0]).toDate());
            res.trend.o3.forEach(e => e[0] = moment(e[0]).toDate());
            res.trend.pm10.forEach(e => e[0] = moment(e[0]).toDate());
            res.trend.pm25.forEach(e => e[0] = moment(e[0]).toDate());
            observer.next(res);
          },
          error => observer.error(error),
          () => observer.complete()
        );
      });
    });
  }

  private findMatchingTime(list: [Date, number][], time: Date): number {
    const value = list.find((e) => {
      if (e[0].getTime() === time.getTime()) {
        return true;
      }
    });
    return value ? value[1] : null;
  }
}
