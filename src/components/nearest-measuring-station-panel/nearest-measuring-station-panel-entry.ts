import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FirstLastValue, StatusIntervalResolverService } from '@helgoland/core';
import invert from 'invert-color';

import { NearestTimeseriesManagerProvider } from '../../providers/nearest-timeseries-manager/nearest-timeseries-manager';
import { NearestTimeseriesProvider } from '../../providers/nearest-timeseries/nearest-timeseries';
import { BelaqiLocation } from '../belaqi-user-location-slider/belaqi-user-location-slider';

interface PanelEntry {
  label: string;
  id: string;
}

@Component({
  selector: '[nearest-measuring-station-panel-entry]',
  templateUrl: 'nearest-measuring-station-panel-entry.html'
})
export class NearestMeasuringStationPanelEntryComponent implements OnChanges {

  public stationDistance: number;
  public stationLabel: string;
  public lastStationaryValue: FirstLastValue;
  public uom: string;
  public backgroundColor: string;
  public color: string;
  public loadingStationValue: boolean = true;

  @Input()
  public entry: PanelEntry;

  @Input()
  public location: BelaqiLocation;

  @Output()
  public onClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private statusIntervalResolver: StatusIntervalResolverService,
    protected nearestTimeseries: NearestTimeseriesProvider,
    protected nearestTimeseriesManager: NearestTimeseriesManagerProvider
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.location && this.location) {
      this.determineNextStationValue();
    }
  }

  public select() {
    this.onClicked.emit(this.entry.id);
  }

  private determineNextStationValue() {
    this.nearestTimeseries.determineNextTimeseries(this.location.latitude, this.location.longitude, this.entry.id).subscribe(nearestSeries => {
      this.nearestTimeseriesManager.setNearestTimeseries(this.location.locationLabel, this.entry.id, nearestSeries.series.internalId);
      this.stationDistance = nearestSeries.distance;
      this.stationLabel = nearestSeries.series.station.properties.label;
      const matchingInterval = this.statusIntervalResolver.getMatchingInterval(nearestSeries.series.lastValue.value, nearestSeries.series.statusIntervals)
      if (matchingInterval) {
        this.backgroundColor = matchingInterval.color;
        this.color = invert(this.backgroundColor, true);
      }
      this.lastStationaryValue = nearestSeries.series.lastValue
      this.uom = nearestSeries.series.uom;
      this.loadingStationValue = false;
    });
  }

}
