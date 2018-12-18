import { Component, OnInit } from '@angular/core';

import { LocateProvider, LocationMode } from '../../providers/locate/locate';

@Component({
  selector: 'geolocation-enabled-icon',
  templateUrl: 'geolocation-enabled-icon.html'
})
export class GeolocationEnabledIconComponent implements OnInit {

  public locationMode: LocationMode;

  constructor(
    private locate: LocateProvider
  ) { }

  public ngOnInit(): void {
    this.locate.getLocationModeAsObservable().subscribe(res => this.locationMode = res);
  }

  public isActive(): boolean {
    return this.locationMode === LocationMode.on;
  }

  public isDeactive(): boolean {
    return this.locationMode === LocationMode.off;
  }

  public isPartial(): boolean {
    return this.locationMode === LocationMode.partial;
  }

}
