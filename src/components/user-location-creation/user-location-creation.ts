import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearchOptions, GeoSearchResult } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { ModalController, ToastController } from 'ionic-angular';
import { MapOptions } from 'leaflet';

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
  public geoSearchResult: GeoSearchResult;
  public locationLabel: string;
  public location: Point;

  constructor(
    protected locationList: UserLocationListProvider,
    private modalCtrl: ModalController,
    private settingsSrvc: SettingsService<MobileSettings>,
    private toast: ToastController,
    private translate: TranslateService,
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.geoSearchOptions = {
      countrycodes: settings.geoSearchCountryCodes,
      asPointGeometry: true,
      addressdetails: true
    };
    this.mapOptions = {
      maxZoom: 18,
      dragging: true
    }
  }

  public geoSearchResultChanged(result: GeoSearchResult) {
    this.geoSearchResult = result;
    this.location = this.geoSearchResult.geometry as Point;
    this.locationLabel = this.createGeoLabel(result);
  }

  private createGeoLabel(geo: GeoSearchResult) {
    if (geo && geo.address) {
      let locationLabel = '';
      if (geo.address.road) { locationLabel = `${geo.address.road} ${geo.address.house_number ? geo.address.house_number : ''}, `; }
      if (geo.address.city || geo.address.town) { locationLabel += (geo.address.city ? geo.address.city : geo.address.town) }
      return locationLabel;
    } else {
      return geo.name;
    }
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
