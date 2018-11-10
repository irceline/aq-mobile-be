import { Injectable } from '@angular/core';
import { GeoReverseResult, GeoSearch } from '@helgoland/map';
import { Geoposition } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocateProvider } from '../locate/locate';

export interface UserLocation {
  id?: number;
  index?: number;
  label?: string;
  type: 'user' | 'current';
  isCurrentVisible?: boolean;
  date?: Date;
  longitude?: number;
  latitude?: number;
}

const STORAGE_USER_LOCATIONS_KEY = 'userlocation';

@Injectable()
export class UserLocationListProvider {

  private userLocations: UserLocation[];

  private userLocationsSubject: ReplaySubject<UserLocation[]> = new ReplaySubject(1);

  public phenomenonIDs = ['391', '8', '7', '5', '6001'];

  constructor(
    protected storage: Storage,
    private geoSearch: GeoSearch,
    protected translateSrvc: TranslateService,
    private locate: LocateProvider
  ) {
    this.loadLocations().subscribe(locations => {
      this.userLocations = locations || [{ type: 'current', isCurrentVisible: false }];
      this.userLocationsSubject.next(this.userLocations);
    })
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
    this.userLocations.push(location);
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

  public hasLocation(label: string, point: Point): boolean {
    return this.userLocations.findIndex(
      e => e.label === label
        && e.longitude === point.coordinates[0]
        && e.latitude === point.coordinates[1]
    ) > -1;
  }

  public getUserLocations(): Observable<UserLocation[]> {
    return this.userLocationsSubject.asObservable();
  }

  public getVisibleUserLocations(): Observable<UserLocation[]> {
    return this.userLocationsSubject.asObservable()
      .pipe(
        map(locs => locs.filter(e => (e.type === 'current' && e.isCurrentVisible && this.locate.getLocationEnabled()) || e.type === 'user'))
      );
  }

  public isCurrentLocationVisible(): Observable<boolean> {
    return this.userLocationsSubject.asObservable().pipe(map(locations => {
      const current = locations.find(e => e.type === 'current');
      return current.isCurrentVisible;
    }))
  }

  public setCurrentLocationVisisble(visible: boolean) {
    const current = this.userLocations.find(e => e.type === 'current');
    current.isCurrentVisible = visible;
    this.storeLocations();
  }

  public setUserLocations(locs: UserLocation[]) {
    this.userLocations = locs;
    this.storeLocations();
  }

  public setLocationList(locations: UserLocation[]) {
    this.userLocations = locations;
    this.storeLocations();
  }

  public removeLocation(userLocation: UserLocation) {
    this.userLocations = this.userLocations.filter(res => res.id !== userLocation.id);
    this.storeLocations();
  }

  public hasLocations(): boolean {
    return this.userLocations && this.userLocations.length > 0;
  }

  public saveLocation(userLocation: UserLocation) {
    const index = this.userLocations.findIndex(res => res.id === userLocation.id);
    this.userLocations[index] = userLocation;
    this.storeLocations();
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

  private storeLocations() {
    this.userLocationsSubject.next(this.userLocations);
    this.storage.set(STORAGE_USER_LOCATIONS_KEY, this.userLocations);
  }

  private loadLocations(): Observable<UserLocation[]> {
    return new Observable<UserLocation[]>((observer: Observer<UserLocation[]>) => {
      this.storage.get(STORAGE_USER_LOCATIONS_KEY).then(res => {
        if (res instanceof Array) {
          observer.next(res);
        } else {
          observer.next(null);
        }
        observer.complete();
      })
    });
  }

}
