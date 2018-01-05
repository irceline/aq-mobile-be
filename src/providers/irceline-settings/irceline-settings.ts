import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { SettingsService } from 'helgoland-toolbox';
import { MobileSettings } from '../settings/settings';

export class IrcelineSettings {
  public lastupdate: string;
  public timestring: string;
  public timestring_day: string;
  public top_pollutant_today: string;
}

@Injectable()
export class IrcelineSettingsProvider {

  public onLastUpdateChanged: EventEmitter<Date> = new EventEmitter;
  public onTopPollutantTodayChanged: EventEmitter<string> = new EventEmitter;

  constructor(
    private http: HttpClient,
    private settings: SettingsService<MobileSettings>
  ) {
    // TODO request consecutive
    this.requestSettings();
  }

  private requestSettings() {
    // TODO needs cors response to avoid proxy!
    const url = 'https://cors-anywhere.herokuapp.com/' + this.settings.getSettings().ircelineSettingsUrl;
    this.http.get<IrcelineSettings>(url).subscribe(result => {
      this.onLastUpdateChanged.emit(new Date(result.lastupdate));
      this.onTopPollutantTodayChanged.emit(result.top_pollutant_today);
    });
  }
}
