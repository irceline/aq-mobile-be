import { Component, ViewChild } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearchOptions, GeoSearchResult } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { Keyboard, ModalController, NavController, NavParams, Slides } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { ModalUserLocationListComponent } from '../../components/modal-user-location-list/modal-user-location-list';
import { MobileSettings } from '../../providers/settings/settings';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { StartPage } from '../start/start';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @ViewChild(Slides) slides: Slides;

  public selectedLang: string;

  public geoSearchOptions: GeoSearchOptions;
  public mapOptions: MapOptions;
  public geoSearchResult: GeoSearchResult;
  public locationLabel: string;

  constructor(
    protected navCtrl: NavController,
    protected navParams: NavParams,
    protected translate: TranslateService,
    protected modalCtrl: ModalController,
    protected keyboard: Keyboard,
    protected settingsSrvc: SettingsService<MobileSettings>,
    protected locationList: UserLocationListProvider
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.selectedLang = this.translate.currentLang;
    this.geoSearchOptions = {
      countrycodes: settings.geoSearchContryCodes,
      asPointGeometry: true
    };
    this.mapOptions = {
      maxZoom: 16,
      dragging: false
    }
  }

  public nextSlide() {
    this.slides.slideTo(this.slides.getActiveIndex() + 1, 500);
  }

  public closeSlides() {
    this.navCtrl.setRoot(StartPage);
  }

  public languageChanged(lang: string) {
    this.translate.use(lang);
  }

  public geoSearchResultChanged(result: GeoSearchResult) {
    this.geoSearchResult = result;
    this.locationLabel = result.name;
  }

  public addLocationToList() {
    this.locationList.addLocation(this.locationLabel, this.geoSearchResult.geometry as Point);
  }

  public showLocationList() {
    this.modalCtrl.create(ModalUserLocationListComponent).present();
  }

  public closeKeyboard() {
    this.keyboard.close();
  }

}
