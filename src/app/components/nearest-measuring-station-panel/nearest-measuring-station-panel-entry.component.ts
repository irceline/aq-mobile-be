import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FirstLastValue, StatusIntervalResolverService, Timeseries } from '@helgoland/core';
import { Point } from 'geojson';

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
  public lastStationaryValue: FirstLastValue;
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
        phenomenonId: this.entry.id,
        latitude,
        longitude
      });
    }
  }

  private determineNextStationValue() {
    this.nearestTimeseries.determineNextTimeseries(this.location.latitude, this.location.longitude, this.entry.id)
      .subscribe(nearestSeries => {
        if (nearestSeries) {
          this.nearestTimeseriesManager.setNearestTimeseries(this.location, this.entry.id, nearestSeries.series.internalId);
          this.series = nearestSeries.series;
          this.stationDistance = nearestSeries.distance;
          this.stationLabel = nearestSeries.series.station.properties.label;
          const matchingInterval = this.statusIntervalResolver
            .getMatchingInterval(nearestSeries.series.lastValue.value, nearestSeries.series.statusIntervals);
          if (matchingInterval) {
            this.borderColor = matchingInterval.color;
          }
          this.lastStationaryValue = nearestSeries.series.lastValue;
          this.uom = nearestSeries.series.uom;
        }
        this.loadingStationValue = false;
        this.ready.emit();
      }, (error) => {
        this.loadingStationValue = false;
        this.ready.emit();
      });
  }
}
