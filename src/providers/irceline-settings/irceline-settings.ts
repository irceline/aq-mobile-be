

import { Injectable } from '@angular/core';
import { HttpService, SettingsService } from '@helgoland/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MobileSettings } from '../settings/settings';

export interface IrcelineSettings {
  lastupdate: Date;
  timestring: string;
  timestring_day: string;
  top_pollutant_today: string;
}

@Injectable()
export class IrcelineSettingsProvider {

  constructor(
    private http: HttpService,
    private settingsService: SettingsService<MobileSettings>
  ) { }

  public getSettings(reload: boolean): Observable<IrcelineSettings> {
    const url = this.settingsService.getSettings().ircelineSettingsUrl;
    return this.http.client({ forceUpdate: reload }).get(url).pipe(
      map(result => {
        return {
          lastupdate: moment(result['lastupdate']).toDate(),
          timestring: result['timestring'],
          timestring_day: result['timestring_day'],
          top_pollutant_today: result['top_pollutant_today']
        }
      })
    )
  }

}
