import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearchOptions, GeoSearchResult } from '@helgoland/map';
import { Point } from 'geojson';
import { ModalController } from 'ionic-angular';
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
    private settingsSrvc: SettingsService<MobileSettings>,
    protected modalCtrl: ModalController,
    protected locationList: UserLocationListProvider
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.geoSearchOptions = {
      countrycodes: settings.geoSearchContryCodes,
      asPointGeometry: true
    };
    this.mapOptions = {
      maxZoom: 16,
      dragging: false
    }
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

}
