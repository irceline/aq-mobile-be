import { Injectable } from '@angular/core';
import { DatasetApiInterface, SettingsService, Station } from '@helgoland/core';
import { Observable, Observer } from 'rxjs';

import { MobileSettings } from '../settings/settings';

export interface NearestTimeseries {
  seriesId: string;
  distance: number;
  nearestStation: Station;
}

@Injectable()
export class NearestTimeseriesProvider {

  constructor(
    private api: DatasetApiInterface,
    private settingsSrvc: SettingsService<MobileSettings>
  ) { }

  public determineNextTimeseries(lat: number, lon: number, phenomenonId: string): Observable<NearestTimeseries> {
    const url = this.settingsSrvc.getSettings().datasetApis[0].url;
    return new Observable((observer: Observer<NearestTimeseries>) => {
      this.api.getStations(url, { phenomenon: phenomenonId })
        .subscribe(res => {
          let distance = Infinity;
          let nearestStation = null;
          res.forEach(station => {
            const point = station.geometry as GeoJSON.Point;
            const stationDis = this.distanceInKmBetweenEarthCoordinates(
              lat,
              lon,
              point.coordinates[1],
              point.coordinates[0]
            );
            if (stationDis < distance) {
              distance = stationDis;
              nearestStation = station;
            }
          })
          this.api.getTimeseries(url, {
            phenomenon: phenomenonId,
            station: nearestStation.properties.id,
            expanded: true
          }, { forceUpdate: true }).subscribe(series => {
            if (series.length === 1) {
              observer.next({ seriesId: series[0].internalId, nearestStation, distance });
              observer.complete();
            }
          })
        });
    });
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
