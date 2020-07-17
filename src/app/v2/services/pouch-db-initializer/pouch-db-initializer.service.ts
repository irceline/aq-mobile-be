import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';

import { ForecastDateService } from '../forecast-date.service';

@Injectable({
  providedIn: 'root'
})
export class PouchDBInitializerService {

  private lastForecastTime: Date;

  constructor(
    private forecastDateSrvc: ForecastDateService
  ) { }

  public init() {
    // Make PouchDB accessible
    (window as any).L.PouchDB = new PouchDB('offline-tiles',
      {
        // Enforce revs limit although we should never create more than necessary anyway
        revs_limit: 1
      });

    // Invalidate old forecast tiles
    // No connection check is necessary since forecastupdate only updates when there is an active network connection
    this.forecastDateSrvc.forecastDate.subscribe(forecastTime => {
      if (this.lastForecastTime !== forecastTime) {
        this.lastForecastTime = forecastTime;
        // Invalidate offline PouchDB cache
        const pouch = (window as any).L.PouchDB;
        pouch.allDocs({}).then(docs => {
          for (let i = 0; i < docs.total_rows; i++) {
            const result = docs.rows[i];
            if (result.id.includes('_d0') || result.id.includes('_d1') || result.id.includes('_d2') || result.id.includes('_d3')) {
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
  }
}
