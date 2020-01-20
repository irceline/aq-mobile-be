import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { GeoSearchOptions, GeoSearchResult } from '@helgoland/map';
import { ModalController, ToastController, PickerController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Point } from 'geojson';
import { MapOptions } from 'leaflet';

import { GeoLabelsService } from '../../services/geo-labels/geo-labels.service';
import { LocateService } from '../../services/locate/locate.service';
import { MobileSettings } from '../../services/settings/settings.service';
import { UserLocationListService } from '../../services/user-location-list/user-location-list.service';
import { ModalUserLocationListComponent } from '../modal-user-location-list/modal-user-location-list.component';
import { UserLocationNotificationsService, UserLocationSubscriptionError } from 'src/app/services/user-location-notifications/user-location-notifications.service';
import { PickerOptions } from '@ionic/core';

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
  public notificationsToggled: boolean;

  private index: number;

  constructor(
    public locationList: UserLocationListService,
    private modalCtrl: ModalController,
    private settingsSrvc: SettingsService<MobileSettings>,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private locate: LocateService,
    private geolabels: GeoLabelsService,
    private locationNotifications: UserLocationNotificationsService,
    private indexPicker: PickerController
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

  public addLocationToList() {
    let toast;
    if (this.locationList.getLocationListLength() >= this.settingsSrvc.getSettings().limitOfAllowedUserLocations) {
      this.toastCtrl.create({ message: this.translate.instant('user-location.creation.limit-reached'), duration: 3000 })
        .then(toast => {
          toast.present();
        });
    } else if (this.locationList.hasLocation(this.locationLabel, this.location)) {
      toast = this.toastCtrl.create({ message: this.translate.instant('user-location.creation.message-exists'), duration: 3000 })
        .then(toast => {
          toast.present();
        });
    } else {
      this.locationList.addUserLocation(this.locationLabel, this.location);
      toast = this.toastCtrl.create({ message: this.translate.instant('user-location.creation.message-added'), duration: 3000 })
        .then(toast => {
          toast.present();
        });

      // Handle subscription to notifications
      if (this.notificationsToggled) {
        let userlocation = this.locationList.getUserLocations().filter(loc => loc.label == this.locationLabel);
        if (userlocation && userlocation[0]) {
          // Index was already set as 
          this.locationNotifications.subscribeLocation(userlocation[0], this.index).subscribe(
            res => { },
            error => {
              // wait until old toasts have disappeared
              setTimeout(() => { this.presentError(error); }, 5000)
            }
          );
        }
      }
    }
    this.modalCtrl.dismiss();
  }

  public onLocationChanged(point: Point) {
    this.location = point;
  }

  public showLocationList() {
    this.modalCtrl.create({ component: ModalUserLocationListComponent }).then(modal => modal.present());
  }

  public toggledNotifications(stateAfterToggle) {
    if (stateAfterToggle) {
      let opts: PickerOptions = {
        mode: "md",
        buttons: [
          {
            text: this.translate.instant("controls.cancel"),
            role: 'cancel',
            handler: (value: any): void => {
              this.notificationsToggled = false;
            }
          },
          {
            text: "Done",
            handler: (value: any): void => {
              this.index = value["index"]["value"];
            },
          },
        ],
        columns: [
          {
            name: "index",
            prefix: this.translate.instant("customize-personal-alerts.alert-index-level"),
            options: [
              { text: '1', value: 1 },
              { text: '2', value: 2 },
              { text: '3', value: 3 },
              { text: '4', value: 4 },
              { text: '5', value: 5 },
              { text: '6', value: 6 },
              { text: '7', value: 7 },
              { text: '8', value: 8 },
              { text: '9', value: 9 },
              { text: '10', value: 10 },
            ]
          }
        ]
      }
      this.indexPicker.create(opts).then(p => {
        p.present();
      }).catch(error => {
        this.presentError(error);
      })
    }
  }

  private presentError(error: UserLocationSubscriptionError): void {
    let message;
    switch (error) {
      case UserLocationSubscriptionError.BackendRegistration:
        message = this.translate.instant('user-location-notification-toggler.backend-registration-error');
        break;
      case UserLocationSubscriptionError.NotificationSubscription:
        message = this.translate.instant('user-location-notification-toggler.notification-error');
        break;
      default:
        message = this.translate.instant('user-location-notification-toggler.default-error');
        break;
    }
    this.toastCtrl.create({ message, duration: 5000 }).then(toast => toast.present());
  }

}
