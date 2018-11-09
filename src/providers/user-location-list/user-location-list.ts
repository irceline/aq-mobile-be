import { Injectable } from '@angular/core';
import { GeoReverseResult, GeoSearch } from '@helgoland/map';
import { Geoposition } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { forkJoin, Observable, Observer, ReplaySubject } from 'rxjs';

import { LocateProvider } from '../locate/locate';

export interface UserLocation {
  id?: number;
  index?: number;
  label?: string;
  type: 'user' | 'current';
  date?: Date;
  longitude?: number;
  latitude?: number;
}

export interface UserLocationSettings {
  currentLocationIndex: number;
  showCurrentLocation: boolean;
  userLocations: UserLocation[];
}

const STORAGE_USER_LOCATIONS_KEY = 'userlocation';
const STORAGE_CURRENT_USERLOCATION_INDEX_KEY = 'current.userlocation.index';
const STORAGE_SHOW_CURRENT_USERLOCATION = 'current.userlocation.index';

@Injectable()
export class UserLocationListProvider {

  private currentUserLocations: UserLocation[];

  private userLocationsSubject: ReplaySubject<UserLocationSettings> = new ReplaySubject(1);

  private showCurrentLocationAt: number = 0;

  private showCurrentLocation: boolean = true;

  public phenomenonIDs = ['391', '8', '7', '5', '6001'];

  constructor(
    protected storage: Storage,
    private geoSearch: GeoSearch,
    protected translateSrvc: TranslateService,
    private locate: LocateProvider
  ) {
    forkJoin([this.loadLocations(), this.loadCurrentLocationIndex(), this.loadShowCurrentLocation()]).subscribe(values => {
      this.currentUserLocations = values[0];
      this.showCurrentLocationAt = values[1];
      this.showCurrentLocation = values[2];
      this.setSubject();
    })
  }

  private setSubject() {
    this.userLocationsSubject.next({
      userLocations: this.currentUserLocations,
      currentLocationIndex: this.showCurrentLocationAt,
      showCurrentLocation: this.showCurrentLocation,
    });
  }

  public addUserLocation(label: string, point: Point) {
    const location = {
      label: label,
      latitude: point.coordinates[1],
      longitude: point.coordinates[0],
      type: 'user',
      id: new Date().getTime(),
      nearestSeries: {}
    } as UserLocation;
    this.currentUserLocations.push(location);
    this.storeLocations();
  }

  public determineCurrentLocation(): Observable<UserLocation> {
    return new Observable((observer: Observer<UserLocation>) => {
      this.locate.getGeoposition().subscribe((pos: Geoposition) => {
        const reverseObs = this.geoSearch.reverse({ type: 'Point', coordinates: [pos.coords.latitude, pos.coords.longitude] });
        reverseObs.subscribe(
          value => {
            let locationLabel = this.createGeoLabel(value);
            observer.next({
              id: 1,
              label: locationLabel,
              type: 'current',
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
            observer.complete();
          },
          error => {
            observer.error(error);
            observer.complete();
          });
      });
    })
  }

  private createGeoLabel(geo: GeoReverseResult) {
    let locationLabel = '';
    if (geo && geo.address) {
      if (geo.address.road) { locationLabel = `${geo.address.road}${geo.address.houseNumber ? ' ' + geo.address.houseNumber : ''}, `; }
      if (geo.address.city || geo.address.cityDistrict) { locationLabel += (geo.address.city || geo.address.cityDistrict) + ', ' }
      if (geo.address.country) { locationLabel += geo.address.country }
    } else {
      locationLabel = this.translateSrvc.instant('belaqi-user-location-slider.current-location');
    }
    return locationLabel;
  }

  public hasLocation(label: string, point: Point): boolean {
    return this.currentUserLocations.findIndex(
      e => e.label === label
        && e.longitude === point.coordinates[0]
        && e.latitude === point.coordinates[1]
    ) > -1;
  }

  public getUserLocations(): Observable<UserLocation[]> {
    return this.userLocationsSubject.asObservable().map(e => e.userLocations);
  }

  public getLocationSettings(): Observable<UserLocationSettings> {
    return this.userLocationsSubject.asObservable();
  }

  public setUserLocations(locs: UserLocation[]) {
    this.currentUserLocations = locs;
    this.storeLocations();
  }

  public getAllLocations(): Observable<UserLocation[]> {
    return new Observable((observer: Observer<UserLocation[]>) => {
      this.userLocationsSubject.subscribe(res => {
        this.locate.getLocationStateEnabled().subscribe(enabled => {
          if (res.showCurrentLocation && enabled) {
            const userLocs: UserLocation[] = Object.assign([], res.userLocations);
            userLocs.splice(this.getCurrentLocationIndex(), 0, { type: 'current' });
            observer.next(userLocs);
            observer.complete();
          } else {
            observer.next(res.userLocations);
            observer.complete();
          }
        })
      })
    })
  }

  public getAllLocationsForEdit(): Observable<UserLocation[]> {
    return new Observable((observer: Observer<UserLocation[]>) => {
      this.getUserLocations().subscribe(userLocs => {
        userLocs = Object.assign([], userLocs);
        userLocs.splice(this.getCurrentLocationIndex(), 0, { type: 'current', });
        observer.next(userLocs);
      })
    })
  }

  public removeLocation(userLocation: UserLocation) {
    this.currentUserLocations = this.currentUserLocations.filter(res => res.id !== userLocation.id);
    this.storeLocations();
  }

  public hasLocations(): boolean {
    return this.currentUserLocations && this.currentUserLocations.length > 0;
  }

  public setShowCurrentLocation(show: boolean) {
    this.showCurrentLocation = show;
    this.storeLocations();
  }

  public getCurrentLocationIndex(): number {
    return this.showCurrentLocationAt;
  }

  public setCurrentLocationIndex(idx: number) {
    this.showCurrentLocationAt = idx;
  }

  public saveLocation(userLocation: UserLocation) {
    const index = this.currentUserLocations.findIndex(res => res.id === userLocation.id);
    this.currentUserLocations[index] = userLocation;
    this.storeLocations();
  }

  private storeLocations() {
    this.setSubject();
    this.storage.set(STORAGE_USER_LOCATIONS_KEY, this.currentUserLocations);
    this.storage.set(STORAGE_CURRENT_USERLOCATION_INDEX_KEY, this.showCurrentLocationAt);
    this.storage.set(STORAGE_SHOW_CURRENT_USERLOCATION, this.showCurrentLocation)
  }

  private loadLocations(): Observable<UserLocation[]> {
    return new Observable<UserLocation[]>((observer: Observer<UserLocation[]>) => {
      this.storage.get(STORAGE_USER_LOCATIONS_KEY).then(res => {
        if (res instanceof Array) {
          observer.next(res);
        } else {
          observer.next([]);
        }
        observer.complete();
      })
    });
  }

  private loadCurrentLocationIndex(): Observable<number> {
    return new Observable<number>((observer: Observer<number>) => {
      this.storage.get(STORAGE_CURRENT_USERLOCATION_INDEX_KEY).then(res => {
        if (res !== undefined) {
          observer.next(res)
        } else {
          observer.next(0)
        }
        observer.complete();
      })
    })
  }

  private loadShowCurrentLocation(): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.storage.get(STORAGE_SHOW_CURRENT_USERLOCATION).then(res => {
        if (res !== undefined) {
          observer.next(res)
        } else {
          observer.next(true)
        }
        observer.complete();
      })
    })
  }

}
