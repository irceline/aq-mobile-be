import { ChangeDetectorRef, Component } from '@angular/core';
import { Platform } from 'helgoland-toolbox';
import { SettingsService } from 'helgoland-toolbox/dist/services/settings/settings.service';
import { ModalController } from 'ionic-angular';

import { MobileSettings } from '../../app/services/settings.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  public providerUrl: string;
  public loading: boolean;

  constructor(
    private settingsSrvc: SettingsService<MobileSettings>,
    public modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    this.providerUrl = this.settingsSrvc.getSettings().restApiUrls[0];
  }

  public onStationSelected(platform: Platform) {
    // const modal = this.modalCtrl.create(StationSelectorComponent,
    //   {
    //     platform,
    //     providerUrl: this.providerUrl
    //   }
    // );
    // modal.onDidDismiss(data => {
    //   if (data) { this.navigator.navigate(Page.Diagram); }
    // });
    // modal.present();
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

}
