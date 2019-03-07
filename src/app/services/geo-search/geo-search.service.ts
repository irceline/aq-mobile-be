import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import {
  GeoReverseOptions,
  GeoReverseResult,
  GeoSearchOptions,
  GeoSearchResult,
  NominatimGeoSearchService,
} from '@helgoland/map';
import { Point } from 'geojson';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';

import { createCacheKey } from '../../model/caching';

const TTL_GEO_SEARCH = 60 * 60 * 24; // one day

@Injectable()
export class GeoSearchService extends NominatimGeoSearchService {

  constructor(
    protected http: HttpService,
    protected httpClient: HttpClient,
    protected cacheService: CacheService
  ) {
    super(http);
  }

  public searchTerm(term: string, options: GeoSearchOptions = {}): Observable<GeoSearchResult> {
    let params = new HttpParams();
    params = params.set('q', term);
    params = params.set('format', 'json');
    params = params.set('limit', '1');
    if (options.countrycodes) { params = params.set('countrycodes', options.countrycodes.join(',')); }
    if (options.addressdetails !== null) { params = params.set('addressdetails', options.addressdetails ? '1' : '0'); }
    if (options.asPointGeometry !== null) { params = params.set('polygon_geojson', options.asPointGeometry ? '0' : '1'); }
    if (options.acceptLanguage) { params = params.set('accept-language', options.acceptLanguage); }
    const url = this.serviceUrl + 'search';
    const request = this.httpClient.get(url, { params });
    return this.cacheService.loadFromObservable(createCacheKey(url, params), request, null, TTL_GEO_SEARCH).map((resArray: any[]) => {
      if (resArray.length === 1) {
        const result = resArray[0];
        const name = result.display_name;
        let geometry;
        if (result.geojson) {
          geometry = result.geojson;
        } else {
          geometry = {
            type: 'Point',
            coordinates: [parseFloat(result.lon), parseFloat(result.lat)]
          };
        }
        const returnResult: GeoSearchResult = { name, geometry };
        if (result.boundingbox) {
          returnResult.bounds = [
            [
              result.boundingbox[0],
              result.boundingbox[2]
            ],
            [
              result.boundingbox[1],
              result.boundingbox[3]
            ]
          ];
        }
        if (result.address) { returnResult.address = result.address; }
        return returnResult;
      }
    });
  }

  public reverse(point: Point, options: GeoReverseOptions = {}): Observable<GeoReverseResult> {
    let params = new HttpParams();
    params = params.set('lat', point.coordinates[0].toString());
    params = params.set('lon', point.coordinates[1].toString());
    params = params.set('format', 'json');
    if (options && options.addressdetails !== undefined) { params = params.set('addressdetails', options.addressdetails ? '1' : '0'); }
    if (options.acceptLanguage !== null) { params = params.set('accept-language', options.acceptLanguage); }
    if (options && options.zoom !== undefined) { params = params.set('zoom', `${options.zoom}`); }
    const url = this.serviceUrl + 'reverse';
    const request = this.httpClient.get(url, { params });
    return this.cacheService.loadFromObservable(createCacheKey(url, params), request, null, TTL_GEO_SEARCH).map((res: any) => {
      const result = {
        lat: res.lat,
        lon: res.lon,
        displayName: res.display_name,
        boundingbox: res.boundingbox
      } as GeoReverseResult;
      if (res.address) {
        result.address = {
          city: res.address.city,
          cityDistrict: res.address.city_district,
          country: res.address.country,
          countryCode: res.address.country_code,
          county: res.address.county,
          houseNumber: res.address.house_number,
          neighbourhood: res.address.neighbourhood,
          postcode: res.address.postcode,
          road: res.address.road,
          state: res.address.state,
          stateDistrict: res.address.state_district,
          suburb: res.address.suburb
        };
      }
      return result;
    });
  }

}
