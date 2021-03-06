import { Component, EventEmitter, OnDestroy, Output, ViewChild, OnInit } from '@angular/core';
import { IonSlides, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { IrcelineSettings, IrcelineSettingsService } from '../../services/irceline-settings/irceline-settings.service';
import { LocateService, LocationStatus } from '../../services/locate/locate.service';
import { NetworkAlertService } from '../../services/network-alert/network-alert.service';
import { RefreshHandler } from '../../services/refresh/refresh.service';
import { StartPageSettingsService } from '../../services/start-page-settings/start-page-settings.service';
import { UserLocation, UserLocationListService } from '../../services/user-location-list/user-location-list.service';
import { ModalUserLocationListComponent } from '../modal-user-location-list/modal-user-location-list.component';
import {
  PhenomenonLocationSelection,
} from '../nearest-measuring-station-panel/nearest-measuring-station-panel-entry.component';
import { HeaderContent } from '../slider-header/slider-header.component';

export interface BelaqiSelection {
  stationlocation?: {
    longitude: number;
    latitude: number;
  };
  phenomenonID: string;
  userlocation: {
    longitude: number;
    latitude: number;
    label: string;
    type: 'user' | 'current';
  };
  yearly: boolean;
}

@Component({
  selector: 'belaqi-user-location-slider',
  templateUrl: './belaqi-user-location-slider.component.html',
  styleUrls: ['./belaqi-user-location-slider.component.scss'],
})
export class BelaqiUserLocationSliderComponent implements OnDestroy, OnInit {

  @ViewChild('slider')
  slider: IonSlides;

  @Output()
  public phenomenonSelected: EventEmitter<BelaqiSelection> = new EventEmitter();

  @Output()
  public headerContent: EventEmitter<HeaderContent> = new EventEmitter();

  public sliderOptions = {
    zoom: false
  };

  public belaqiLocations: UserLocation[] = [];
  public currentLocation: UserLocation;

  public slidesHeight: string;

  public currentLocationError: string;
  public currentLocationErrorExplanation: string;

  public showNearestStationsPanel: boolean;
  private showNearestStationsSubscriber: Subscription;

  public showSubIndexPanel: boolean;
  private showSubIndexPanelSubscriber: Subscription;

  public showAnnualMeanPanel: boolean;
  private showAnnualMeanPanelSubscriber: Subscription;

  private refresherSubscriber: Subscription;
  private locationStatusSubscriber: Subscription;
  private networkSubscriber: Subscription;
  private userLocationSubscriber: Subscription;

  private loadingLocations = false;

  constructor(
    private userLocationService: UserLocationListService,
    private startPageSettingsService: StartPageSettingsService,
    private ircelineSettings: IrcelineSettingsService,
    private locate: LocateService,
    private networkAlert: NetworkAlertService,
    protected translateSrvc: TranslateService,
    protected modalCtrl: ModalController,
    protected refreshHandler: RefreshHandler,
    private toast: ToastController
  ) { }

  public ngOnInit() {
    this.locationStatusSubscriber = this.locate.getLocationStatusAsObservable().subscribe(locationStatus => {
      if (locationStatus !== LocationStatus.DENIED) {
        this.loadBelaqis(false);
      }
    });

    this.refresherSubscriber = this.refreshHandler.onRefresh.subscribe(() => this.loadBelaqis(true));
    this.userLocationSubscriber = this.userLocationService.locationsChanged.subscribe(() => this.loadBelaqis(false));
    this.networkSubscriber = this.networkAlert.onConnected.subscribe(() => this.loadBelaqis(false));

    this.showNearestStationsSubscriber = this.startPageSettingsService.getShowNearestStations()
      .subscribe(val => this.showNearestStationsPanel = val);
    this.showSubIndexPanelSubscriber = this.startPageSettingsService.getShowSubIndexPanel()
      .subscribe(val => this.showSubIndexPanel = val);
    this.showAnnualMeanPanelSubscriber = this.startPageSettingsService.getShowAnnualMeanPanel()
      .subscribe(val => this.showAnnualMeanPanel = val);
  }

  public gotToFirstSlide() {
    if (this.slider) {
      this.slider.slideTo(0, 0);
    }
  }

  public ngOnDestroy(): void {
    if (this.refresherSubscriber) { this.refresherSubscriber.unsubscribe(); }
    if (this.locationStatusSubscriber) { this.locationStatusSubscriber.unsubscribe(); }
    if (this.userLocationSubscriber) { this.userLocationSubscriber.unsubscribe(); }
    if (this.networkSubscriber) { this.networkSubscriber.unsubscribe(); }
    if (this.showNearestStationsSubscriber) { this.showNearestStationsSubscriber.unsubscribe(); }
    if (this.showSubIndexPanelSubscriber) { this.showSubIndexPanelSubscriber.unsubscribe(); }
    if (this.showAnnualMeanPanelSubscriber) { this.showAnnualMeanPanelSubscriber.unsubscribe(); }
  }

  public selectPhenomenonLocation(selection: PhenomenonLocationSelection, userlocation: UserLocation, yearly: boolean) {
    this.phenomenonSelected.emit({
      phenomenonID: selection.phenomenonId,
      stationlocation: {
        latitude: selection.latitude,
        longitude: selection.longitude
      },
      userlocation: {
        latitude: userlocation.latitude,
        longitude: userlocation.longitude,
        label: userlocation.label,
        type: userlocation.type
      },
      yearly
    });
  }

  public selectPhenomenon(phenId: string, userlocation: UserLocation, yearly: boolean) {
    this.phenomenonSelected.emit({
      phenomenonID: phenId,
      userlocation: {
        latitude: userlocation.latitude,
        longitude: userlocation.longitude,
        label: userlocation.label,
        type: userlocation.type
      },
      yearly
    });
  }

  public openUserLocation() {
    this.modalCtrl.create({ component: ModalUserLocationListComponent }).then(modal => modal.present());
  }

  public slideChanged() {
    this.slider.getActiveIndex().then(idx => this.updateLocationSelection(idx));
  }

  public isLocateDenied(): boolean {
    return this.locate.getLocationStatus() === LocationStatus.DENIED;
  }

  private updateLocationSelection(idx: number) {
    this.setHeader(idx);
    if (this.slider) {
      if (idx <= this.belaqiLocations.length - 1) {
      } else {
        this.headerContent.emit(null);
      }
    }
  }

  private setHeader(idx: number): any {
    if (idx <= this.belaqiLocations.length - 1) {
      this.headerContent.emit({
        label: this.belaqiLocations[idx].label,
        date: this.belaqiLocations[idx].date,
        current: this.belaqiLocations[idx].type === 'current'
      });
    }
  }

  private getYPosition(el) {
    let yPos = 0;
    while (el) {
      yPos += (el.offsetTop - el.clientTop);
      el = el.offsetParent;
    }
    return yPos;
  }

  private async loadBelaqis(reload: boolean) {
    if (this.userLocationService.hasLocations() && !this.loadingLocations) {
      this.currentLocationError = undefined;
      this.loadingLocations = true;
      this.ircelineSettings.getSettings(reload).subscribe(
        ircelineSettings => {
          this.belaqiLocations = [];
          this.userLocationService.getVisibleUserLocations().forEach((loc, i) => {
            if (loc.type !== 'current') {
              this.setLocation(loc, i, ircelineSettings);
            } else {
              this.belaqiLocations[i] = {
                type: 'current'
              };
              switch (this.userLocationService.getLocationStatus()) {
                case LocationStatus.OFF:
                  this.currentLocationError = this.translateSrvc.instant('network.geolocationDisabled');
                  this.currentLocationErrorExplanation = this.translateSrvc.instant('network.geolocationDisabledExplanation');
                  break;
                case LocationStatus.DENIED: {
                  this.currentLocationError = this.translateSrvc.instant('network.geolocationDenied');
                  this.currentLocationErrorExplanation = this.translateSrvc.instant('network.geolocationDeniedExplanation');
                  break;
                }
                default: {
                  // let timeout = window.setTimeout(() => this.presentDelayedLocateHint(), LOCATION_DELAYED_NOTIFICATION_IN_MILLISECONDS);
                  this.userLocationService.determineCurrentLocation().subscribe(
                    currentLoc => {
                      this.setLocation(currentLoc, i, ircelineSettings);
                      this.updateLocationSelection(0);
                      // clearTimeout(timeout);
                    },
                    error => {
                      // this.presentDelayedLocateHint();
                      this.currentLocationError = this.translateSrvc.instant('belaqi-user-location-slider.current-location-error-header');
                      this.currentLocationErrorExplanation = error;
                    }
                  );
                }
              }
            }
          });
          setTimeout(() => {
            if (this.slider) {
              this.slider.update();
              this.slider.slideTo(0);
            }
            this.updateLocationSelection(0);
          }, 300);
          this.loadingLocations = false;
        },
        error => {
          this.loadingLocations = false;
        });
    }
  }

  private setLocation(loc: UserLocation, i: number, ircelineSettings: IrcelineSettings) {
    this.belaqiLocations[i] = {
      label: loc.label,
      date: ircelineSettings.lastupdate,
      type: loc.type,
      latitude: loc.latitude,
      longitude: loc.longitude
    };
  }

  private handleError(lon: number, lat: number, error: any) {
    console.warn(`Belaqi for (latitude: ${lat}, longitude ${lon}): ${error} - maybe outside of Belgium`);
  }
}
