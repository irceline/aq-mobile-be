import { Component, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { GeoSearch } from '@helgoland/map';
import { Geoposition } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, Slides } from 'ionic-angular';
import { forkJoin } from 'rxjs';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LocateProvider } from '../../providers/locate/locate';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { ModalUserLocationCreationComponent } from '../modal-user-location-creation/modal-user-location-creation';

export interface BelaqiLocation {
  index: number;
  locationLabel: string;
  date: Date;
  longitude: number;
  latitude: number;
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
    private ircelineSettings: IrcelineSettingsProvider,
    private locate: LocateProvider,
    protected translateSrvc: TranslateService,
    private geoSearch: GeoSearch,
    protected modalCtrl: ModalController
  ) {
    this.loadBelaqis();
    this.loadBelaqiForCurrentLocation();
  }

  public ngAfterViewInit(): void {
    this.slider.autoHeight = true;
  }

  public selectPhenomenon(phenomenonId: string) {
    this.phenomenonSelected.emit(phenomenonId);
  }

  public createNewLocation() {
    this.modalCtrl.create(ModalUserLocationCreationComponent).present();
  }

  private loadBelaqiForCurrentLocation() {

    this.locate.getGeoposition().subscribe((pos: Geoposition) => {
      const ircelSetObs = this.ircelineSettings.getSettings(false);
      const belaqiObs = this.belaqiIndexProvider.getValue(pos.coords.latitude, pos.coords.longitude);
      const reverseObs = this.geoSearch.reverse({ type: 'Point', coordinates: [pos.coords.latitude, pos.coords.longitude] });
      forkJoin([ircelSetObs, belaqiObs, reverseObs]).subscribe(value => {
        const locationLabel = value[2].displayName || this.translateSrvc.instant('belaqi-user-location-slider.current-location');
        this.currentLocation = {
          index: value[1],
          locationLabel,
          date: value[0].lastupdate,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
      }, error => { });
    });
  }

  private loadBelaqis() {
    this.ircelineSettings.getSettings(false).subscribe(ircelineSettings => {
      this.userLocationProvider.getUserLocations().subscribe(
        locations => {
          this.belaqiLocations = [];
          locations.forEach((loc, index) => {
            const lat = loc.point.coordinates[1]
            const lon = loc.point.coordinates[0];
            this.belaqiIndexProvider.getValue(lat, lon).subscribe(
              res => {
                this.belaqiLocations.push({
                  index: res,
                  locationLabel: loc.label,
                  date: ircelineSettings.lastupdate,
                  latitude: lat,
                  longitude: lon
                });
              }
            )
          })
        }
      );
    });
  }

}
