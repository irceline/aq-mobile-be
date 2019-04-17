import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StatusIntervalResolverService, Timeseries } from '@helgoland/core';
import { Point } from 'geojson';

import { getMainPhenomenonForID, MainPhenomenon } from '../../model/phenomenon';
import { DailyMeanValueService } from '../../services/daily-mean-value/daily-mean-value.service';
import { IrcelineSettingsService } from '../../services/irceline-settings/irceline-settings.service';
import {
  NearestTimeseriesManagerService,
} from '../../services/nearest-timeseries-manager/nearest-timeseries-manager.service';
import { NearestTimeseriesService } from '../../services/nearest-timeseries/nearest-timeseries.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import { NearestMeasuringStationPanelEntry } from './nearest-measuring-station-panel.component';

export interface PhenomenonLocationSelection {
  phenomenonId: string;
  longitude: number;
  latitude: number;
}

@Component({
  selector: 'nearest-measuring-station-panel-entry',
  templateUrl: './nearest-measuring-station-panel-entry.component.html',
  styleUrls: ['./nearest-measuring-station-panel-entry.component.scss'],
})
export class NearestMeasuringStationPanelEntryComponent implements OnChanges {
  public stationDistance: number;
  public stationLabel: string;
  public lastStationaryValue: number;
  public uom: string;
  public borderColor: string;
  public loadingStationValue = true;

  public series: Timeseries;

  @Input()
  public entry: NearestMeasuringStationPanelEntry;

  @Input()
  public location: UserLocation;

  @Output()
  public clicked: EventEmitter<PhenomenonLocationSelection> = new EventEmitter<PhenomenonLocationSelection>();

  @Output()
  public ready: EventEmitter<void> = new EventEmitter();

  constructor(
    private statusIntervalResolver: StatusIntervalResolverService,
    private dailyMeanValueSrvc: DailyMeanValueService,
    private ircelineSettings: IrcelineSettingsService,
    protected nearestTimeseries: NearestTimeseriesService,
    protected nearestTimeseriesManager: NearestTimeseriesManagerService
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.location && this.location) {
      this.determineNextStationValue();
    }
  }

  public select() {
    if (this.series && this.series.station.geometry.type === 'Point') {
      const longitude = (this.series.station.geometry as Point).coordinates[0];
      const latitude = (this.series.station.geometry as Point).coordinates[1];
      this.clicked.emit({
        phenomenonId: this.entry.phenomenonId,
        latitude,
        longitude
      });
    }
  }

  private determineNextStationValue() {
    this.nearestTimeseries.determineNextTimeseries(this.location.latitude, this.location.longitude, this.entry.phenomenonId)
      .subscribe(nearestSeries => {
        if (nearestSeries) {
          this.nearestTimeseriesManager.setNearestTimeseries(this.location, this.entry.phenomenonId, nearestSeries.series.internalId);
          this.series = nearestSeries.series;
          this.stationDistance = nearestSeries.distance;
          this.stationLabel = nearestSeries.series.station.properties.label;
          this.uom = nearestSeries.series.uom;

          const phenomenon = getMainPhenomenonForID(this.entry.phenomenonId);
          if (phenomenon === MainPhenomenon.PM10 || phenomenon === MainPhenomenon.PM25) {
            this.dailyMeanValueSrvc.get24hValue(
              this.stationLabel,
              this.location.date,
              phenomenon
            ).subscribe(res => {
              this.borderColor = res.color;
              this.lastStationaryValue = res.value;
            });
          } else {
            const matchingInterval = this.statusIntervalResolver
              .getMatchingInterval(nearestSeries.series.lastValue.value, nearestSeries.series.statusIntervals);
            if (matchingInterval) {
              this.borderColor = matchingInterval.color;
            }
            this.lastStationaryValue = nearestSeries.series.lastValue.value;
          }
        }
        this.loadingStationValue = false;
        this.ready.emit();
      }, (error) => {
        this.loadingStationValue = false;
        this.ready.emit();
      });
  }
}
