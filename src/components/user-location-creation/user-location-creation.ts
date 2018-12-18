import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearchOptions, GeoSearchResult } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { ModalController, ToastController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

import { GeoLabelsProvider } from '../../providers/geo-labels/geo-labels';
import { LocateProvider } from '../../providers/locate/locate';
import { MobileSettings } from '../../providers/settings/settings';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { ModalUserLocationListComponent } from '../modal-user-location-list/modal-user-location-list';

@Component({
  selector: 'user-location-creation',
  templateUrl: 'user-location-creation.html'
})
export class UserLocationCreationComponent {

  public geoSearchOptions: GeoSearchOptions;
  public mapOptions: MapOptions;
  public locationLabel: string;
  public location: Point;
  public loadCurrentLocation: boolean;

  constructor(
    protected locationList: UserLocationListProvider,
    private modalCtrl: ModalController,
    private settingsSrvc: SettingsService<MobileSettings>,
    private toast: ToastController,
    private translate: TranslateService,
    private locate: LocateProvider,
    private geolabels: GeoLabelsProvider
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.geoSearchOptions = {
      countrycodes: settings.geoSearchCountryCodes,
      asPointGeometry: true,
      acceptLanguage: this.translate.currentLang,
      addressdetails: true
    };
    this.mapOptions = {
      maxZoom: 18,
      dragging: true
    }
  }

  public geoSearchResultChanged(result: GeoSearchResult) {
    this.resetLocation();
    if (result) {
      this.location = result.geometry as Point;
      this.locationLabel = this.geolabels.createLabelOfSearchResult(result);
    }
  }

  public getCurrentLocation() {
    this.loadCurrentLocation = true;
    this.resetLocation();
    this.locate.determineGeoLocation().subscribe(res => {
      const lat = parseFloat(res.lat);
      const lon = parseFloat(res.lon);
      this.location = { type: 'Point', coordinates: [lon, lat] }
      this.locationLabel = this.geolabels.createLabelOfReverseResult(res);
      this.loadCurrentLocation = false;
    })
  }

  public resetLocation() {
    this.locationLabel = null;
    this.location = null;
  }

  public addLocationToList() {
    if (this.locationList.hasLocation(this.locationLabel, this.location)) {
      this.toast.create(
        {
          message: this.translate.instant('user-location.creation.message.exists'),
          duration: 3000
        }).present();
    } else {
      this.locationList.addUserLocation(this.locationLabel, this.location); this.toast.create({
        message: this.translate.instant('user-location.creation.message.added'),
        duration: 3000
      }).present();
    }
  }

  public onLocationChanged(point: Point) {
    this.location = point;
  }

  public showLocationList() {
    this.modalCtrl.create(ModalUserLocationListComponent).present();
  }

}
