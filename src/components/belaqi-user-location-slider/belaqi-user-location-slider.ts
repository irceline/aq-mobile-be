import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { GeoSearch } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, Slides } from 'ionic-angular';
import { forkJoin } from 'rxjs';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LocateProvider } from '../../providers/locate/locate';
import { NearestTimeseries, NearestTimeseriesProvider } from '../../providers/nearest-timeseries/nearest-timeseries';
import { LocatedTimeseriesService } from '../../providers/timeseries/located-timeseries';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { ModalUserLocationCreationComponent } from '../modal-user-location-creation/modal-user-location-creation';

export interface BelaqiLocation {
  index?: number;
  locationLabel: string;
  type: 'user' | 'current';
  date: Date;
  longitude?: number;
  latitude?: number;
  nearestSeries?: {
    [key: string]: NearestTimeseries
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
  public phenomenonSelected: EventEmitter<string> = new EventEmitter();

  public belaqiLocations: BelaqiLocation[] = [];
  public currentLocation: BelaqiLocation;

  constructor(
    private belaqiIndexProvider: BelaqiIndexProvider,
    private userLocationProvider: UserLocationListProvider,
    private locatedTimeseriesProvider: LocatedTimeseriesService,
    private ircelineSettings: IrcelineSettingsProvider,
    protected translateSrvc: TranslateService,
    protected modalCtrl: ModalController,
    protected nearestTimeseries: NearestTimeseriesProvider
  ) {
    this.loadBelaqis();
  }

  public ngAfterViewInit(): void {
    this.slider.autoHeight = false;
  }

  public selectPhenomenon(phenomenonId: string) {
    this.phenomenonSelected.emit(phenomenonId);
  }

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  public slideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    this.updateLocationSelection(currentIndex);
  }

  private updateLocationSelection(idx: number) {
    if (idx <= this.belaqiLocations.length - 1) {
      this.locatedTimeseriesProvider.setSelectedIndex(idx);
      this.locatedTimeseriesProvider.removeAllDatasets();
      for (const key in this.belaqiLocations[idx].nearestSeries) {
        if (this.belaqiLocations[idx].nearestSeries.hasOwnProperty(key)) {
          const element = this.belaqiLocations[idx].nearestSeries[key];
          this.locatedTimeseriesProvider.addDataset(element.seriesId);
        }
      }
    }
  }

  private loadBelaqiForCurrentLocation() {
    if (this.userLocationProvider.showCurrentLocation()) {
      this.userLocationProvider.determineCurrentLocation().subscribe(location => {
        const lat = location.point.coordinates[1];
        const lon = location.point.coordinates[0];
        const ircelSetObs = this.ircelineSettings.getSettings(false);
        const belaqiObs = this.belaqiIndexProvider.getValue(lat, lon);
        forkJoin([ircelSetObs, belaqiObs]).subscribe(
          value => {
            const idx = this.userLocationProvider.getCurrentLocationIndex();
            this.belaqiLocations.splice(idx, 0, {
              type: "current",
              index: value[1],
              locationLabel: location.label,
              date: value[0].lastupdate,
              latitude: lat,
              longitude: lon,
              nearestSeries: location.nearestSeries
            });
            this.updateLocationSelection(0);
          },
          error => this.handleError(lon, lat, error)
        );
      });
    }
  }

  private loadBelaqis() {
    this.ircelineSettings.getSettings(false).subscribe(ircelineSettings => {
      this.userLocationProvider.getUserLocations().subscribe(
        locations => {
          this.belaqiLocations = [];
          locations.forEach((loc, i) => {
            const lat = loc.point.coordinates[1]
            const lon = loc.point.coordinates[0];
            this.belaqiLocations[i] = {
              locationLabel: loc.label,
              date: ircelineSettings.lastupdate,
              type: 'user',
              latitude: lat,
              longitude: lon,
              nearestSeries: loc.nearestSeries
            }
            this.belaqiIndexProvider.getValue(lat, lon).subscribe(
              res => {
                this.belaqiLocations[i].index = res;
              },
              error => this.handleError(lon, lat, error))
          })
          if (this.userLocationProvider.showCurrentLocation()) {
            this.loadBelaqiForCurrentLocation();
          } else {
            this.updateLocationSelection(0);
          }
        }
      );
    });
  }

  private handleError(lon: number, lat: number, error: any) {
    console.error(`Get an error while fetching belaqi for location (latitude: ${lat}, longitude ${lon}): ${error}`);
  }

}
