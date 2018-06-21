import { Injectable } from '@angular/core';
import { HttpService, SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MobileSettings } from '../settings/settings';

export interface AirQualityEntity {
  [key: string]: AirQualityEntityEntry
}

export interface AirQualityEntityEntry {
  label: string;
  index: AirQualityIndex[];
}

export interface AirQualityIndex {
  period: string;
  datetime: Date;
  type: string;
  value: string;
  evaluation: string;
  moreinfo: string;
}

@Injectable()
export class AirQualityIndexProvider {

  constructor(
    private http: HttpService,
    private translate: TranslateService,
    private settings: SettingsService<MobileSettings>
  ) { }

  public getAirQualityIndex(reload: boolean): Observable<AirQualityEntity> {
    return this.http.client({ forceUpdate: reload }).get<{ entity: AirQualityEntity }>(this.settings.getSettings().ircelineAQIndexUrl,
      {
        responseType: 'json',
        params: {
          lang: this.translate.currentLang,
          format: 'json',
          fdays: '3'
        }
      }
    ).pipe(
      map((res) => {
        return res.entity;
      })
    )
  }

}
