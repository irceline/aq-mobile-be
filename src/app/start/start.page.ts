import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import {
  BelaqiSelection,
  HeaderContent,
} from '../components/belaqi-user-location-slider/belaqi-user-location-slider.component';
import { RefreshHandler } from '../services/refresh/refresh.service';

@Component({
  selector: 'page-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage {

  public sliderHeaderContent: HeaderContent;

  constructor(
    // private nav: NavController,
    private refreshHandler: RefreshHandler,
    private platform: Platform,
    private toast: ToastController,
    public translateSrvc: TranslateService
  ) { }

  public navigateToMap(selection: BelaqiSelection) {
    // this.nav.push(MapPage, { belaqiSelection: selection });
  }

  public setHeaderContent(headerContent: HeaderContent) {
    let visibility;
    if (headerContent) {
      visibility = 'inherit';
      this.sliderHeaderContent = headerContent;
    } else {
      visibility = 'hidden';
    }
    const locationHeaderElems = document.querySelectorAll('.location-header');
    for (let i = 0; i < locationHeaderElems.length; i++) {
      (locationHeaderElems[i] as HTMLElement).style.visibility = visibility;
    }
  }

  public async doRefresh(event) {
    this.refreshHandler.refresh();
    if (this.platform.is('cordova')) {
      const toast = await this.toast.create({ message: this.translateSrvc.instant('refresh-button.message'), duration: 3000 });
      toast.present();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

}
