import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DatasetApiInterface, FirstLastValue, SettingsService, Station } from '@helgoland/core';
import { Geoposition } from '@ionic-native/geolocation';

import { MobileSettings } from '../../providers/settings/settings';

interface PanelEntry {
  label: string;
  id: string;
}

@Component({
  selector: '[closest-measuring-station-panel-entry]',
  templateUrl: 'closest-measuring-station-panel-entry.html'
})
export class ClosestMeasuringStationPanelEntryComponent implements OnChanges {

  private nearestStation: Station;
  public stationDistance: number;
  public lastStationaryValue: FirstLastValue;
  public uom: string;
  public loadingStationValue: boolean = true;

  @Input()
  public entry: PanelEntry;

  @Input()
  public position: Geoposition;

  @Output()
  public onClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private settingsSrvc: SettingsService<MobileSettings>,
    private api: DatasetApiInterface
  ) { }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.position && this.position) {
      this.determineNextStationValue()
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
        const stationLat = station.geometry.coordinates[1];
        const stationLon = station.geometry.coordinates[0];
        const stationDis = this.distanceInKmBetweenEarthCoordinates(this.position.coords.latitude, this.position.coords.longitude, stationLat, stationLon);
        if (stationDis < this.stationDistance) {
          this.stationDistance = stationDis;
          this.nearestStation = station;
        }
      })
      this.api.getTimeseries(url, {
        phenomenon: phenomenonId,
        station: this.nearestStation.properties.id,
        expanded: true
      }, { forceUpdate: true }).subscribe(series => {
        if (series.length == 1) {
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
