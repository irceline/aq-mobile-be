import 'rxjs/add/operator/do';

import { Injectable } from '@angular/core';
import { HttpService, SettingsService } from '@helgoland/core';
import { Observable } from 'rxjs/Observable';

import { MobileSettings } from '../settings/settings';

export interface IrcelineSettings {
  lastupdate: Date;
  timestring: string;
  timestring_day: string;
  top_pollutant_today: string;
}

@Injectable()
export class IrcelineSettingsProvider {

  private settings: IrcelineSettings;

  constructor(
    private http: HttpService,
    private settingsService: SettingsService<MobileSettings>
  ) { }

  public getSettings(): Observable<IrcelineSettings> {
    if (this.settings) {
      return Observable.of(this.settings);
    } else {
      return this.requestSettings();
    }
  }

  private requestSettings(): Observable<IrcelineSettings> {
    // TODO needs cors response to avoid proxy!
    const url = 'https://cors-anywhere.herokuapp.com/' + this.settingsService.getSettings().ircelineSettingsUrl;
    return this.http.client()
      .get(url)
      .map(result => {
        return {
          lastupdate: new Date(result['lastupdate']),
          timestring: result['timestring'],
          timestring_day: result['timestring_day'],
          top_pollutant_today: result['top_pollutant_today']
        }
      })
      .do(settings => this.settings = settings);
  }
}
