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

  constructor(
    protected locationList: UserLocationListProvider,
    private modalCtrl: ModalController,
    private settingsSrvc: SettingsService<MobileSettings>,
    private toast: ToastController,
    private translate: TranslateService,
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.geoSearchOptions = {
      countrycodes: settings.geoSearchContryCodes,
      asPointGeometry: true
    };
    this.mapOptions = {
      maxZoom: 18,
      dragging: false
    }
  }

  public geoSearchResultChanged(result: GeoSearchResult) {
    this.geoSearchResult = result;
    this.locationLabel = result.name;
  }

  public addLocationToList() {
    if (this.locationList.hasLocation(this.locationLabel, this.geoSearchResult.geometry as Point)) {
      this.toast.create(
        {
          message: this.translate.instant('user-location.creation.message.exists'),
          duration: 3000
        }
      ).present();
    } else {
      this.locationList.addLocation(this.locationLabel, this.geoSearchResult.geometry as Point);
      this.toast.create({
        message: this.translate.instant('user-location.creation.message.added'),
        duration: 3000
      }
      ).present();
    }
  }

  public showLocationList() {
    this.modalCtrl.create(ModalUserLocationListComponent).present();
  }

}
