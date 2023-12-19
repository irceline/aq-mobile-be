import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import belgium from '../../../../assets/belgium.json';
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

  private _locations = locations;

  constructor(
    private httpClient: HttpClient,
    private cacheService: CacheService,
    private translate: TranslateService
  ) { }

  public getLocationLabel(latitude: number, longitude: number): Location {
    let distance = Infinity;
    // @ts-ignore
    let entry: Location = null;
    const langCode = this.translate.currentLang;
    this._locations.forEach(e => {
      const dist = this.distanceInKmBetweenEarthCoordinates(latitude, longitude, e.latitude, e.longitude);
      if (dist < distance) {
        distance = dist;
        entry = {
          label: e.label[langCode],
          latitude: e.latitude,
          longitude: e.longitude
        };
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

  public reverse(lat: number, lng: number, options: any = {}): Observable<Location> {
    let params = new HttpParams();
    params = params.set('lat', lat.toString());
    params = params.set('lon', lng.toString());
    params = params.set('format', 'json');
    if (options && options.addressdetails !== undefined) { params = params.set('addressdetails', options.addressdetails ? '1' : '0'); }
    if (options.acceptLanguage !== null) { params = params.set('accept-language', options.acceptLanguage); }
    if (options && options.zoom !== undefined) { params = params.set('zoom', `${options.zoom}`); }
    const url = NOMINATIM_URL + 'reverse';
    const request = this.httpClient.get(url, { params });
    // @ts-ignore
    return this.cacheService.loadFromObservable(createCacheKey(url, params.toString()), request, null, TTL_GEO_SEARCH)
      .pipe(map(res => ({
        label: this.createLabelOfReverseResult(res),
        longitude: lng,
        latitude: lat
      })));
  }

  private createLabelOfReverseResult(reverse: any): string {
    const labels = [];
    if (reverse && reverse.address) {
      if (reverse.address.road) {
        // @ts-ignore
        labels.push(`${reverse.address.road}${reverse.address.houseNumber ? ' ' + reverse.address.houseNumber : ''}`);
      }
      if (reverse.address.city || reverse.address.town || reverse.address.city_district) {
        // @ts-ignore
        labels.push(reverse.address.city || reverse.address.town || reverse.address.city_district);
      }
    }
    return labels.join(', ');
  }

  public insideBelgium(lat: number, lng: number): boolean {
    let inside = false;
    const belgiumBounds = belgium as GeoJSON.FeatureCollection;
    belgiumBounds.features.forEach(e => {
      const multipolygon = e.geometry as GeoJSON.MultiPolygon;
      const polygons = multipolygon.coordinates;
      polygons.forEach(pol => {
        inside = this.isPointInPolygon(lat, lng, pol[0]);
      });
    });
    return inside;
  }

  private isPointInPolygon(lat: number, lng: number, poly: GeoJSON.Position[]) {
    const x = lat, y = lng;

    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][1], yi = poly[i][0];
      const xj = poly[j][1], yj = poly[j][0];

      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) { inside = !inside; }
    }

    return inside;
  }

}
