import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Point } from 'geojson';
import { Observable, Observer, ReplaySubject } from 'rxjs';

export interface UserLocation {
  id: number;
  point: Point;
  label: string;
}

const STORAGE_KEY = 'userlocation';

@Injectable()
export class UserLocationListProvider {

  private currentUserLocations: UserLocation[];

  private userLocationsSubject: ReplaySubject<UserLocation[]> = new ReplaySubject(1);

  constructor(
    protected storage: Storage
  ) {
    this.loadLocations().subscribe(res => {
      this.currentUserLocations = res;
      this.userLocationsSubject.next(this.currentUserLocations);
    });
  }

  public addLocation(label: string, point: Point) {
    this.currentUserLocations.push({
      label,
      point,
      id: new Date().getTime()
    });
    this.storeLocations();
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

  public removeLocation(userLocation: UserLocation) {
    this.currentUserLocations = this.currentUserLocations.filter(res => res.id !== userLocation.id);
    this.storeLocations();
  }

  public hasLocations(): boolean {
    return this.currentUserLocations && this.currentUserLocations.length > 0;
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
