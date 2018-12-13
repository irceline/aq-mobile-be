import { Injectable } from '@angular/core';
import { DatasetApiInterface, SettingsService, Station, Timeseries } from '@helgoland/core';
import moment from 'moment';
import { Observable, Observer } from 'rxjs';

import { IrcelineSettingsProvider } from '../irceline-settings/irceline-settings';
import { MobileSettings } from '../settings/settings';

interface DistancedStation extends Station {
  distance: number;
}

export interface NearestTimeseries {
  distance: number;
  series: Timeseries;
}

@Injectable()
export class NearestTimeseriesProvider {

  constructor(
    private api: DatasetApiInterface,
    private settingsSrvc: SettingsService<MobileSettings>,
    private ircelineSettingsProv: IrcelineSettingsProvider
  ) { }

  public determineNextTimeseries(lat: number, lon: number, phenomenonId: string): Observable<NearestTimeseries> {
    const url = this.settingsSrvc.getSettings().datasetApis[0].url;
    return new Observable((observer: Observer<NearestTimeseries>) => {
      this.api.getStations(url, { phenomenon: phenomenonId }, { forceUpdate: false })
        .subscribe((stations: DistancedStation[]) => {
          const copy = JSON.parse(JSON.stringify(stations));
          copy.forEach((station: DistancedStation) => {
            const point = station.geometry as GeoJSON.Point;
            station.distance = this.distanceInKmBetweenEarthCoordinates(lat, lon, point.coordinates[1], point.coordinates[0]);
          })
          copy.sort((a, b) => a.distance - b.distance);
          if (copy.length > 0) {
            this.getNextSeries(url, phenomenonId, copy, 0, observer);
          } else {
            observer.complete();
          }
        }, error => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  private getNextSeries(url: string, phenomenonId: string, stations: DistancedStation[], index: number, observer: Observer<NearestTimeseries>) {
    if (index < stations.length - 1) {
      const distance = stations[index].distance;
      this.ircelineSettingsProv.getSettings(false).subscribe(settings => {
        this.api.getTimeseries(url, {
          phenomenon: phenomenonId,
          station: stations[index].properties.id,
          expanded: true
        }, { expirationAtMs: moment().add(10, 'minutes').unix() * 1000 })
          .subscribe(series => {
            if (series.length === 1) {
              const lastDate = new Date(series[0].lastValue.timestamp).getTime();
              const maximumTimeframe = settings.lastupdate.getTime() - this.settingsSrvc.getSettings().nearestStationTimeBufferInMillseconds;
              if (lastDate >= maximumTimeframe) {
                observer.next({
                  distance: distance,
                  series: series[0]
                });
                observer.complete();
              } else {
                this.getNextSeries(url, phenomenonId, stations, index + 1, observer);
              }
            }
          }, error => {
            observer.error(error);
            observer.complete();
          });
      }, error => {
        observer.error(error);
        observer.complete();
      })
    } else {
      observer.complete();
    }
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
