import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';

import { ForecastDateService } from '../forecast-date.service';
import { CacheService } from 'ionic-cache';
import { from } from 'rxjs';

const FORECAST_TIMESTRING_URL = 'https://geobelair.irceline.be/www/timestring_forecast.php';

@Injectable({
  providedIn: 'root'
})
export class PouchDBInitializerService {

  private lastForecastTime: Date;

  constructor(
    private cache: CacheService,
    private forecastDateSrvc: ForecastDateService
  ) { }

  public init() {
    // Make PouchDB accessible
    (window as any).L.PouchDB = new PouchDB('offline-tiles',
      {
        // Enforce revs limit although we should never create more than necessary anyway
        revs_limit: 1
      });
    // Load last forecast date from cache
    this.cache.getItem<Date>(FORECAST_TIMESTRING_URL)
      .then(v => new Date(v))
      .catch(v => new Date(0))
      .then(cachedValue => {
        this.lastForecastTime = cachedValue;
        // Invalidate old forecast tiles if there is a new forecast 
        // No connection check is necessary since forecastupdate only updates when there is an active network connection
        this.forecastDateSrvc.forecastDate.subscribe(forecastTime => {
          if (this.lastForecastTime !== forecastTime) {
            // We have a new forecastTime so we need to invalidate all old forecasts
            this.lastForecastTime = forecastTime;
            // Invalidate offline PouchDB cache
            const pouch = (window as any).L.PouchDB;
            pouch.allDocs({}).then(docs => {
              for (let i = 0; i < docs.total_rows; i++) {
                const result = docs.rows[i];
                if (result.id.includes('_d0') || result.id.includes('_d1') || result.id.includes('_d2') || result.id.includes('_d3')) {
                  console.log("purging");
                  pouch.remove(result.key, result.value.rev);
                }
              }
            }).catch(err => {
              console.log(err);
            });
            pouch.compact()
              .then(() => { })
              .catch(err => {
                console.log(err);
              });
          }
        });
      });
  }
}
