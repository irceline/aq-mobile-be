import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

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
    private http: HttpClient,
    private translate: TranslateService,
    private settings: SettingsService<MobileSettings>
  ) { }

  getAirQualityIndex(): Observable<AirQualityEntity> {
    return this.http.get<{ entity: AirQualityEntity }>(this.settings.getSettings().ircelineAQIndexUrl,
      {
        responseType: 'json',
        params: {
          lang: this.translate.currentLang,
          format: 'json',
          fdays: '3'
        }
      }
    ).map((res) => {
      return res.entity;
    })
  }

}
