import { Injectable } from '@angular/core';

import locations from '../../../../assets/locations.json';

interface Location {
  label: string;
  longitude: number;
  latitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  private _locations: Location[] = locations;

  constructor() { }

  public getLocationLabel(latitude: number, longitude: number): string {
    let distance = Infinity;
    let entry: Location = null;
    this._locations.forEach(e => {
      const dist = this.distanceInKmBetweenEarthCoordinates(latitude, longitude, e.latitude, e.longitude);
      if (dist < distance) {
        distance = dist;
        entry = e;
      }
    });
    console.log(`Nearest location is ${entry.label} with distance ${distance}`);
    return entry.label;
  }

  private distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  private degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }

}
