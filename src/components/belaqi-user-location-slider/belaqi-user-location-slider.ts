import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, Slides, Toggle } from 'ionic-angular';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { IrcelineSettings, IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LocateProvider } from '../../providers/locate/locate';
import { RefreshHandler } from '../../providers/refresh/refresh';
import { LocatedTimeseriesService } from '../../providers/timeseries/located-timeseries';
import { UserLocation, UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { ModalUserLocationCreationComponent } from '../modal-user-location-creation/modal-user-location-creation';
import { ModalUserLocationListComponent } from '../modal-user-location-list/modal-user-location-list';
import { PhenomenonLocationSelection } from '../nearest-measuring-station-panel/nearest-measuring-station-panel-entry';

export interface HeaderContent {
  label: string;
  date: Date;
  current: boolean;
}

export interface BelaqiSelection {
  phenomenonStation: PhenomenonLocationSelection,
  location: {
    longitude: number;
    latitude: number;
    label: string;
    type: 'user' | 'current';
  }
}

@Component({
  selector: 'belaqi-user-location-slider',
  templateUrl: 'belaqi-user-location-slider.html'
})
export class BelaqiUserLocationSliderComponent implements AfterViewInit {

  @ViewChild('slider')
  slider: Slides;

  @Output()
  public phenomenonSelected: EventEmitter<BelaqiSelection> = new EventEmitter();

  @Output()
  public headerContent: EventEmitter<HeaderContent> = new EventEmitter();

  public belaqiLocations: UserLocation[] = [];
  public currentLocation: UserLocation;

  public showCurrentLocation: boolean;

  public slidesHeight: string;

  private loading: boolean;

  constructor(
    private belaqiIndexProvider: BelaqiIndexProvider,
    private userLocationProvider: UserLocationListProvider,
    private locatedTimeseriesProvider: LocatedTimeseriesService,
    private ircelineSettings: IrcelineSettingsProvider,
    private locate: LocateProvider,
    protected translateSrvc: TranslateService,
    protected modalCtrl: ModalController,
    protected refresher: RefreshHandler
  ) {
    this.locate.getLocationStateEnabled().subscribe(enabled => this.loadBelaqis());
    this.refresher.onRefresh.subscribe(() => this.loadBelaqis());
    this.userLocationProvider.getLocationSettings().subscribe(setts => this.showCurrentLocation = setts.showCurrentLocation);
  }

  public ngAfterViewInit(): void {
    this.slider.autoHeight = false;
  }

  public selectPhenomenon(selection: PhenomenonLocationSelection, userlocation: UserLocation) {
    this.phenomenonSelected.emit({
      phenomenonStation: selection,
      location: {
        latitude: userlocation.latitude,
        longitude: userlocation.longitude,
        label: userlocation.label,
        type: userlocation.type
      }
    });
  }

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  public openUserLocation() {
    this.modalCtrl.create(ModalUserLocationListComponent).present();
  }

  public slideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    const slide = this.slider._slides[currentIndex];
    this.slidesHeight = slide.clientHeight + 'px';
    this.updateLocationSelection(currentIndex);
  }

  public slideWillChange() {
    this.slidesHeight = 'auto';
  }

  public toggle(toggle: Toggle) {
    this.userLocationProvider.setShowCurrentLocation(toggle.value);
  }

  private updateLocationSelection(idx: number) {
    if (idx <= this.belaqiLocations.length - 1) {
      this.headerContent.emit({
        label: this.belaqiLocations[idx].label,
        date: this.belaqiLocations[idx].date,
        current: this.belaqiLocations[idx].type === 'current'
      })
      this.locatedTimeseriesProvider.setSelectedIndex(idx);
      this.locatedTimeseriesProvider.removeAllDatasets();
    } else {
      const height = window.outerHeight - this.getYPosition(this.slider.container);
      // 58 is the height of the header without padding/margin
      this.slidesHeight = `${height + 58}px`;
      this.headerContent.emit(null);
    }
  }

  private getYPosition(el) {
    var yPos = 0;
    while (el) {
      yPos += (el.offsetTop - el.clientTop);
      el = el.offsetParent;
    }
    return yPos;
  }

  private loadBelaqis() {
    if (!this.loading) {
      this.loading = true;
      this.ircelineSettings.getSettings(false).subscribe(ircelineSettings => {
        this.userLocationProvider.getLocationSettings().subscribe(
          () => {
            this.belaqiLocations = [];
            this.userLocationProvider.getAllLocations().subscribe(locations => {
              locations.forEach((loc, i) => {
                if (loc.type !== 'current') {
                  this.setLocation(loc, i, ircelineSettings);
                } else {
                  this.userLocationProvider.determineCurrentLocation().subscribe(currentLoc => {
                    this.setLocation(currentLoc, i, ircelineSettings);
                    if (i === 0) { this.updateLocationSelection(0); }
                  })
                }
              })
              if (this.slider) {
                this.slider.slideTo(0);
              }
              this.updateLocationSelection(0);
              this.loading = false;
            });
          }
        );
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
    this.belaqiIndexProvider.getValue(loc.latitude, loc.longitude).subscribe(res => this.belaqiLocations[i].index = res, error => this.handleError(loc.longitude, loc.latitude, error));
  }

  private handleError(lon: number, lat: number, error: any) {
    console.error(`Get an error while fetching belaqi for location (latitude: ${lat}, longitude ${lon}): ${error}`);
  }

}
