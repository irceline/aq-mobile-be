import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';

import locations from '../../../../assets/locations.json';
import { createCacheKey } from '../../common/caching';

interface Location {
  label: string;
  longitude: number;
  latitude: number;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/';
const TTL_GEO_SEARCH = 60 * 60 * 24; // one day

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  private _locations: Location[] = locations;

  constructor(
    private httpClient: HttpClient,
    private cacheService: CacheService
  ) { }

  public getLocationLabel(latitude: number, longitude: number): Location {
    let distance = Infinity;
    let entry: Location = null;
    this._locations.forEach(e => {
      const dist = this.distanceInKmBetweenEarthCoordinates(latitude, longitude, e.latitude, e.longitude);
      if (dist < distance) {
        distance = dist;
        entry = e;
      }
    });
    return entry;
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

  public reverse(lat: number, lng: number, options: any = {}): Observable<any> {
    let params = new HttpParams();
    params = params.set('lat', lat.toString());
    params = params.set('lon', lng.toString());
    params = params.set('format', 'json');
    if (options && options.addressdetails !== undefined) { params = params.set('addressdetails', options.addressdetails ? '1' : '0'); }
    if (options.acceptLanguage !== null) { params = params.set('accept-language', options.acceptLanguage); }
    if (options && options.zoom !== undefined) { params = params.set('zoom', `${options.zoom}`); }
    const url = NOMINATIM_URL + 'reverse';
    const request = this.httpClient.get(url, { params });
    return this.cacheService.loadFromObservable(createCacheKey(url, params.toString()), request, null, TTL_GEO_SEARCH);
  }

}
