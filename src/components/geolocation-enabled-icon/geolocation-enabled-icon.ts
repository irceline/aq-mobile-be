import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform, ToastController } from 'ionic-angular';

import { LocateProvider } from '../../providers/locate/locate';

@Component({
  selector: 'geolocation-enabled-icon',
  templateUrl: 'geolocation-enabled-icon.html'
})
export class GeolocationEnabledIconComponent implements OnInit {

  public geolocationEnabled: boolean;

  public init = false;

  constructor(
    private locate: LocateProvider,
    private toast: ToastController,
    private platform: Platform,
    private translate: TranslateService,
  ) { }

  public ngOnInit(): void {
    this.locate.getLocationStateEnabled().subscribe(res => {
      this.geolocationEnabled = res;
      if (this.platform.is('cordova') && this.init) {
        const message = res ? this.translate.instant('network.geolocationEnabled') : this.translate.instant('network.geolocationDisabled');
        this.toast.create({ message, duration: 5000 }).present();
      }
      this.init = true;
    });
  }

}
