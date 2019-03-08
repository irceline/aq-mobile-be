import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequestOptions,
  HttpService,
  InternalIdHandler,
  ParameterFilter,
  SplittedDataDatasetApiInterface,
  Timeseries,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

import { createCacheKey } from '../../model/caching';
import { IrcelineSettingsService } from '../irceline-settings/irceline-settings.service';

@Injectable()
export class CustomDatasetApiInterfaceService extends SplittedDataDatasetApiInterface {

  constructor(
    protected httpservice: HttpService,
    protected internalDatasetId: InternalIdHandler,
    protected translate: TranslateService,
    protected cacheService: CacheService,
    protected ircelineSettings: IrcelineSettingsService,
    protected http: HttpClient
  ) {
    super(httpservice, internalDatasetId, translate);
  }

  public getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Timeseries[]> {
    const url = this.createRequestUrl(apiUrl, 'timeseries');
    return this.requestApi<Timeseries[]>(url, params).pipe(map(
      res => {
        res.forEach(e => {
          e.url = apiUrl;
          this.internalDatasetId.generateInternalId(e);
        });
        return res;
      }
    ));
  }

  public getSingleTimeseries(id: string, apiUrl: string, params?: ParameterFilter): Observable<Timeseries> {
    const url = this.createRequestUrl(apiUrl, 'timeseries', id);
    return this.requestApi(url, params).pipe(map((result: any) => {
      const timeseries = this.createInstanceFromJson(Timeseries, result);
      timeseries.url = apiUrl;
      this.internalDatasetId.generateInternalId(timeseries);
      return timeseries;
    }));
  }

  protected requestApi<T>(url: string, params: ParameterFilter = {}, options: HttpRequestOptions = {}): Observable<T> {
    options.forceUpdate = true;
    return new Observable((observer: Observer<T>) => {
      this.ircelineSettings.getSettings().subscribe(settings => {
        const request = this.http.get<T>(url, {
          params: this.prepareParams(params),
          headers: this.createBasicAuthHeader(options.basicAuthToken)
        });
        this.cacheService.loadFromObservable(createCacheKey(url, params, settings.lastupdate), request).subscribe(
          res => observer.next(res),
          error => observer.error(error),
          () => observer.complete()
        );
      });
    });
  }

  private createInstanceFromJson<T>(objType: new () => T, json: any): T {
    const newObj = new objType();
    const relationships = objType['relationships'] || {};
    for (const prop in json) {
      if (json.hasOwnProperty(prop)) {
        if (newObj[prop] == null) {
          if (relationships[prop] == null) {
            newObj[prop] = json[prop];
          } else {
            newObj[prop] = this.createInstanceFromJson(relationships[prop], json[prop]);
          }
        } else {
          console.warn(`Property ${prop} not set because it already existed on the object.`);
        }
      }
    }
    return newObj;
  }
}
