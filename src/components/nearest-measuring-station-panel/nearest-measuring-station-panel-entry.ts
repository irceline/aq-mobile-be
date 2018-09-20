import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DatasetApiInterface, FirstLastValue, InternalIdHandler, StatusIntervalResolverService } from '@helgoland/core';
import invert from 'invert-color';

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
    private api: DatasetApiInterface,
    private statusIntervalResolver: StatusIntervalResolverService,
    private idHandler: InternalIdHandler
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
    const nearestSeries = this.location.nearestSeries[this.entry.id];
    const seriesid = this.idHandler.resolveInternalId(nearestSeries.seriesId).id;
    const url = this.idHandler.resolveInternalId(nearestSeries.seriesId).url;
    this.api.getSingleTimeseries(seriesid, url, { forceUpdate: true }).subscribe(timeseries => {
      const matchingInterval = this.statusIntervalResolver.getMatchingInterval(timeseries.lastValue.value, timeseries.statusIntervals)
      if (matchingInterval) {
        this.backgroundColor = matchingInterval.color;
        this.color = invert(this.backgroundColor, true);
      }
      this.lastStationaryValue = timeseries.lastValue
      this.uom = timeseries.uom;
      this.loadingStationValue = false;
    })

    this.stationDistance = nearestSeries.distance;
    this.stationLabel = nearestSeries.nearestStation.properties.label;
  }

}
