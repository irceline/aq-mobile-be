import { Component, OnInit } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { LocateProvider } from '../../providers/locate/locate';
import { GeolocationEnabledIconPopupComponent } from './geolocation-enabled-icon-popup';

@Component({
  selector: 'geolocation-enabled-icon',
  templateUrl: 'geolocation-enabled-icon.html'
})
export class GeolocationEnabledIconComponent implements OnInit {

  public geolocationEnabled: boolean;

  public init = false;

  constructor(
    private locate: LocateProvider,
    private popoverCtrl: PopoverController
  ) { }

  public ngOnInit(): void {
    this.locate.getLocationStateEnabled().subscribe(res => this.geolocationEnabled = res);
  }

  public inform(ev) {
    this.popoverCtrl
      .create(GeolocationEnabledIconPopupComponent, { geolocationEnabled: this.geolocationEnabled })
      .present({ ev });
  }

}
