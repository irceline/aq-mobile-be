import { Injectable } from '@angular/core';
import { GeoSearch } from '@helgoland/map';
import { Geoposition } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { forkJoin, Observable, Observer, ReplaySubject } from 'rxjs';

import { LocateProvider } from '../locate/locate';
import { NearestTimeseries, NearestTimeseriesProvider } from '../nearest-timeseries/nearest-timeseries';

export interface UserLocation {
  id: number;
  point: Point;
  label: string;
  type: 'user' | 'current';
  nearestSeries: {
    [key: string]: NearestTimeseries
  }
}

const STORAGE_KEY = 'userlocation';

@Injectable()
export class UserLocationListProvider {

  private currentUserLocations: UserLocation[];

  private userLocationsSubject: ReplaySubject<UserLocation[]> = new ReplaySubject(1);

  private showCurrentLocationBeforeIndex: number = 0;

  public phenomenonIDs = ['391', '8', '7', '5', '6001'];

  constructor(
    protected storage: Storage,
    protected nearestTimeseries: NearestTimeseriesProvider,
    private geoSearch: GeoSearch,
    protected translateSrvc: TranslateService,
    private locate: LocateProvider
  ) {
    this.loadLocations().subscribe(res => {
      this.currentUserLocations = res;
      this.userLocationsSubject.next(this.currentUserLocations);
    });
  }

  public addUserLocation(label: string, point: Point) {
    const lat = point.coordinates[1];
    const lon = point.coordinates[0];
    const obs = this.phenomenonIDs.map(id => this.nearestTimeseries.determineNextTimeseries(lat, lon, id));
    forkJoin(obs).subscribe((resultList) => {
      const location = {
        label,
        point,
        type: 'user',
        id: new Date().getTime(),
        nearestSeries: {}
      } as UserLocation;
      resultList.forEach((entry, idx) => {
        location.nearestSeries[this.phenomenonIDs[idx]] = entry;
      })
      this.currentUserLocations.push(location);
      this.storeLocations();
    })
  }

  public determineCurrentLocation(): Observable<UserLocation> {
    return new Observable((observer: Observer<UserLocation>) => {
      this.locate.getGeoposition().subscribe((pos: Geoposition) => {
        const reverseObs = this.geoSearch.reverse({ type: 'Point', coordinates: [pos.coords.latitude, pos.coords.longitude] });
        reverseObs.subscribe(
          value => {
            const locationLabel = value.displayName || this.translateSrvc.instant('belaqi-user-location-slider.current-location');
            const obs = this.phenomenonIDs.map(id => this.nearestTimeseries.determineNextTimeseries(pos.coords.latitude, pos.coords.longitude, id));
            forkJoin(obs).subscribe((resultList) => {
              const nearestSeries = {};
              resultList.forEach((entry, idx) => {
                nearestSeries[this.phenomenonIDs[idx]] = entry;
              });
              observer.next({
                id: 1,
                label: locationLabel,
                type: 'current',
                point: {
                  type: 'Point',
                  coordinates: [pos.coords.longitude, pos.coords.latitude]
                },
                nearestSeries
              });
              observer.complete();
            })
          },
          error => {
            observer.error(error);
            observer.complete();
          });
      });
    })
  }

  public hasLocation(label: string, point: Point): boolean {
    return this.currentUserLocations.findIndex(
      e => e.label === label
        && e.point.coordinates[0] === point.coordinates[0]
        && e.point.coordinates[1] === point.coordinates[1]
    ) > -1;
  }

  public getUserLocations(): Observable<UserLocation[]> {
    return this.userLocationsSubject.asObservable();
  }

  public getAllLocations(): Observable<UserLocation[]> {
    if (this.showCurrentLocation()) {
      return new Observable((observer: Observer<UserLocation[]>) => {
        this.getUserLocations().subscribe(userLocs => {
          this.determineCurrentLocation().subscribe(currentLoc => {
            userLocs = Object.assign([], userLocs);
            userLocs.splice(this.getCurrentLocationIndex(), 0, currentLoc);
            observer.next(userLocs);
          })
        })
      })
    } else {
      return this.getUserLocations();
    }
  }

  public removeLocation(userLocation: UserLocation) {
    this.currentUserLocations = this.currentUserLocations.filter(res => res.id !== userLocation.id);
    this.storeLocations();
  }

  public hasLocations(): boolean {
    return this.currentUserLocations && this.currentUserLocations.length > 0;
  }

  public showCurrentLocation(): boolean {
    return this.showCurrentLocationBeforeIndex >= 0;
  }

  public getCurrentLocationIndex(): number {
    return this.showCurrentLocationBeforeIndex;
  }

  public saveLocation(userLocation: UserLocation) {
    const index = this.currentUserLocations.findIndex(res => res.id === userLocation.id);
    this.currentUserLocations[index] = userLocation;
    this.storeLocations();
  }

  private storeLocations() {
    this.userLocationsSubject.next(this.currentUserLocations)
    this.storage.set(STORAGE_KEY, this.currentUserLocations);
  }

  private loadLocations(): Observable<UserLocation[]> {
    return new Observable<UserLocation[]>((observer: Observer<UserLocation[]>) => {
      this.storage.get(STORAGE_KEY).then(res => {
        if (res instanceof Array) {
          observer.next(res);
        } else {
          observer.next([]);
        }
        observer.complete()
      })
    });
  }

}
