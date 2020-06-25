import { HttpClient } from '@angular/common/http';
import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { Observable, Observer } from 'rxjs';

import { createCacheKey } from '../../common/caching';
import { MainPhenomenon } from '../../common/phenomenon';
import { rioifdmWmsURL } from '../../common/services';
import { UserLocation } from '../../Interfaces';
import { IrcelineSettingsService } from '../irceline-settings/irceline-settings.service';
import { ValueProvider } from './value-provider';

enum ModelledPhenomenon {
  no2 = 'rioifdm:no2_hmean',
  o3 = 'rioifdm:o3_hmean',
  pm10 = 'rioifdm:pm10_24hmean',
  pm25 = 'rioifdm:pm25_24hmean'
}

export interface ModelledValue {
  value: number;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class ModelledValueService extends ValueProvider {

  constructor(
    protected http: HttpClient,
    private cacheService: CacheService,
    private ircelineSettings: IrcelineSettingsService
  ) {
    super(http);
  }

  public getValue(userLocation: UserLocation, phenomenon: MainPhenomenon): Observable<ModelledValue> {
    return new Observable<ModelledValue>((observer: Observer<ModelledValue>) => {
      this.ircelineSettings.getSettings().subscribe(
        settings => {

          const layerId = this.createLayerId(phenomenon);
          const params = {
            service: 'WMS',
            request: 'GetFeatureInfo',
            version: '1.1.1',
            layers: layerId,
            info_format: 'application/json',
            time: settings.lastupdate.toISOString(),
            width: '1',
            height: '1',
            srs: 'EPSG:4326',
            bbox: this.calculateRequestBbox(userLocation.latitude, userLocation.longitude),
            query_layers: layerId,
            X: '1',
            Y: '1'
          };
          const request = this.http.get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(rioifdmWmsURL, { params });
          this.cacheService.loadFromObservable(createCacheKey(rioifdmWmsURL, JSON.stringify(params), settings.lastupdate), request)
            .subscribe(
              (res => {
                const value = this.getValueOfResponse(res);
                if (isDefined(value)) {
                  observer.next({
                    value,
                    index: this.categorize(value, phenomenon)
                  });
                } else {
                  throw new Error('No value returned');
                }
                observer.complete();
              })
            );
        }
      );
    });
  }

  private createLayerId(phenomenon: MainPhenomenon) {
    switch (phenomenon) {
      case MainPhenomenon.NO2:
        return ModelledPhenomenon.no2.toString();
      case MainPhenomenon.O3:
        return ModelledPhenomenon.o3.toString();
      case MainPhenomenon.PM10:
        return ModelledPhenomenon.pm10.toString();
      case MainPhenomenon.PM25:
        return ModelledPhenomenon.pm25.toString();
    }
  }

  private categorize(value: number, phenomenon: MainPhenomenon): number {
    switch (phenomenon) {
      case MainPhenomenon.O3:
        return this.categorizeO3(value);
      case MainPhenomenon.PM10:
        return this.categorizePM10(value);
      case MainPhenomenon.PM25:
        return this.categorizePM25(value);
      case MainPhenomenon.NO2:
        return this.categorizeNO2(value);
      case MainPhenomenon.BC:
        return this.categorizeBC(value);
      default:
        throw new Error('not implemented for ' + phenomenon);
    }
  }

  private categorizeNO2(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 20) { return 1; }
    if (value <= 50) { return 2; }
    if (value <= 70) { return 3; }
    if (value <= 120) { return 4; }
    if (value <= 150) { return 5; }
    if (value <= 180) { return 6; }
    if (value <= 200) { return 7; }
    if (value <= 250) { return 8; }
    if (value <= 300) { return 9; }
    return 10;
  }

  private categorizeO3(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 25) { return 1; }
    if (value <= 50) { return 2; }
    if (value <= 70) { return 3; }
    if (value <= 120) { return 4; }
    if (value <= 160) { return 5; }
    if (value <= 180) { return 6; }
    if (value <= 240) { return 7; }
    if (value <= 280) { return 8; }
    if (value <= 320) { return 9; }
    return 10;
  }

  private categorizePM10(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 10) { return 1; }
    if (value <= 20) { return 2; }
    if (value <= 30) { return 3; }
    if (value <= 40) { return 4; }
    if (value <= 50) { return 5; }
    if (value <= 60) { return 6; }
    if (value <= 70) { return 7; }
    if (value <= 80) { return 8; }
    if (value <= 100) { return 9; }
    return 10;
  }

  private categorizePM25(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 5) { return 1; }
    if (value <= 10) { return 2; }
    if (value <= 15) { return 3; }
    if (value <= 25) { return 4; }
    if (value <= 35) { return 5; }
    if (value <= 40) { return 6; }
    if (value <= 50) { return 7; }
    if (value <= 60) { return 8; }
    if (value <= 70) { return 9; }
    return 10;
  }

  private categorizeBC(value: number): number {
    if (value <= -1) { return 0; }
    if (value <= 0.99) { return 1; }
    if (value <= 1.99) { return 2; }
    if (value <= 2.99) { return 3; }
    if (value <= 3.99) { return 4; }
    if (value <= 4.99) { return 5; }
    if (value <= 6.99) { return 6; }
    if (value <= 9.99) { return 7; }
    if (value <= 14.99) { return 8; }
    if (value <= 19.99) { return 9; }
    return 10;
  }

}
