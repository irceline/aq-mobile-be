import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  DatasetApiInterface,
  FirstLastValue,
  SettingsService,
  Station,
  StatusIntervalResolverService,
} from '@helgoland/core';
import invert from 'invert-color';

import { MobileSettings } from '../../providers/settings/settings';
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

  private nearestStation: Station;
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
    private settingsSrvc: SettingsService<MobileSettings>,
    private api: DatasetApiInterface,
    private statusIntervalResolver: StatusIntervalResolverService
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
    const url = this.settingsSrvc.getSettings().datasetApis[0].url;
    const phenomenonId = this.entry.id;
    this.api.getStations(url, {
      phenomenon: phenomenonId,
    }).subscribe(stations => {
      this.nearestStation = null;
      this.stationDistance = Infinity;
      stations.forEach(station => {
        const point = station.geometry as GeoJSON.Point;
        const stationDis = this.distanceInKmBetweenEarthCoordinates(
          this.location.latitude,
          this.location.longitude,
          point.coordinates[1],
          point.coordinates[0]
        );
        if (stationDis < this.stationDistance) {
          this.stationDistance = stationDis;
          this.nearestStation = station;
        }
      })
      this.stationLabel = this.nearestStation.properties.label;
      this.api.getTimeseries(url, {
        phenomenon: phenomenonId,
        station: this.nearestStation.properties.id,
        expanded: true
      }, { forceUpdate: true }).subscribe(series => {
        if (series.length == 1) {
          const matchingInterval = this.statusIntervalResolver.getMatchingInterval(series[0].lastValue.value, series[0].statusIntervals)
          if (matchingInterval) {
            this.backgroundColor = matchingInterval.color;
            this.color = invert(this.backgroundColor, true);
          }
          this.lastStationaryValue = series[0].lastValue
          this.uom = series[0].uom;
        }
        this.loadingStationValue = false;
      })
    }, error => this.loadingStationValue = false);
  }

  private distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2 - lat1);
    var dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  private degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }

}
