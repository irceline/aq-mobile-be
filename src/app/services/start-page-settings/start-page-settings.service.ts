import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Observable, ReplaySubject } from 'rxjs';

const STORAGE_SHOW_NEAREST_STATIONS_KEY = 'showNearestStations';
const STORAGE_SHOW_SUB_INDEX_PANEL_KEY = 'showSubIndexPanel';
const STORAGE_SHOW_ANNUAL_MEAN_PANEL_KEY = 'showAnnuelMeanPanel';

@Injectable()
export class StartPageSettingsService {

  private showNearestStationsReplay: ReplaySubject<boolean> = new ReplaySubject(1);
  private showSubIndexPanelReplay: ReplaySubject<boolean> = new ReplaySubject(1);
  private showAnnualMeanPanelReplay: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    protected storage: Storage,
    protected translateSrvc: TranslateService
  ) {
    this.loadShowNearestStations();
    this.loadShowSubIndexPanel();
    this.loadShowAnnualMeanPanel();
  }

  // show nearest stations
  public setShowNearestStations(show: boolean) {
    this.storage.set(STORAGE_SHOW_NEAREST_STATIONS_KEY, show);
    this.showNearestStationsReplay.next(show);
  }

  public getShowNearestStations(): Observable<boolean> {
    return this.showNearestStationsReplay.asObservable();
  }

  private loadShowNearestStations() {
    this.storage.get(STORAGE_SHOW_NEAREST_STATIONS_KEY)
      .then(res => this.showNearestStationsReplay.next(res))
      .catch(error => console.error(error));
  }

  // show sub index panel
  public setShowSubIndexPanel(show: boolean) {
    this.storage.set(STORAGE_SHOW_SUB_INDEX_PANEL_KEY, show);
    this.showSubIndexPanelReplay.next(show);
  }

  public getShowSubIndexPanel(): Observable<boolean> {
    return this.showSubIndexPanelReplay.asObservable();
  }

  private loadShowSubIndexPanel() {
    this.storage.get(STORAGE_SHOW_SUB_INDEX_PANEL_KEY)
      .then(res => this.showSubIndexPanelReplay.next(res === null ? true : res))
      .catch(error => console.error(error));
  }

  // show annual mean panel
  public setShowAnnualMeanPanel(show: boolean) {
    this.storage.set(STORAGE_SHOW_ANNUAL_MEAN_PANEL_KEY, show);
    this.showAnnualMeanPanelReplay.next(show);
  }

  public getShowAnnualMeanPanel(): Observable<boolean> {
    return this.showAnnualMeanPanelReplay.asObservable();
  }

  private loadShowAnnualMeanPanel() {
    this.storage.get(STORAGE_SHOW_ANNUAL_MEAN_PANEL_KEY)
      .then(res => this.showAnnualMeanPanelReplay.next(res === null ? true : res))
      .catch(error => console.error(error));
  }
}
