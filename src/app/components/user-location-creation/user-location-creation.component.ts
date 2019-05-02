import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearchOptions, GeoSearchResult } from '@helgoland/map';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { MapOptions } from 'leaflet';

import { GeoLabelsService } from '../../services/geo-labels/geo-labels.service';
import { LocateService } from '../../services/locate/locate.service';
import { MobileSettings } from '../../services/settings/settings.service';
import { UserLocationListService } from '../../services/user-location-list/user-location-list.service';
import { ModalUserLocationListComponent } from '../modal-user-location-list/modal-user-location-list.component';

@Component({
  selector: 'user-location-creation',
  templateUrl: './user-location-creation.component.html',
  styleUrls: ['./user-location-creation.component.scss'],
})
export class UserLocationCreationComponent {

  public geoSearchOptions: GeoSearchOptions;
  public mapOptions: MapOptions;
  public locationLabel: string;
  public location: Point;
  public loadCurrentLocation: boolean;

  constructor(
    public locationList: UserLocationListService,
    private modalCtrl: ModalController,
    private settingsSrvc: SettingsService<MobileSettings>,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private locate: LocateService,
    private geolabels: GeoLabelsService
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
    };
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
    this.locate.determineGeoLocation(true).subscribe(location => {
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);
      this.location = { type: 'Point', coordinates: [lon, lat] };
      this.locationLabel = this.geolabels.createLabelOfReverseResult(location);
      this.loadCurrentLocation = false;
    }, error => {
      this.loadCurrentLocation = false;
    });
  }

  public resetLocation() {
    this.locationLabel = null;
    this.location = null;
  }

  public async addLocationToList() {
    let toast;
    if (this.locationList.getLocationListLength() >= this.settingsSrvc.getSettings().limitOfAllowedUserLocations) {
      toast = await this.toastCtrl.create({ message: this.translate.instant('user-location.creation.limit-reached'), duration: 5000 });
    } else if (this.locationList.hasLocation(this.locationLabel, this.location)) {
      toast = await this.toastCtrl.create({ message: this.translate.instant('user-location.creation.message-exists'), duration: 3000 });
    } else {
      this.locationList.addUserLocation(this.locationLabel, this.location);
      toast = await this.toastCtrl.create({ message: this.translate.instant('user-location.creation.message-added'), duration: 3000 });
      this.modalCtrl.dismiss();
    }
    toast.present();
  }

  public onLocationChanged(point: Point) {
    this.location = point;
  }

  public showLocationList() {
    this.modalCtrl.create({ component: ModalUserLocationListComponent }).then(modal => modal.present());
  }

}
