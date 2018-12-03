import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonAffixEvent } from 'ion-affix/dist/directives/ion-affix-event';
import { NavController, Platform, Refresher, ToastController } from 'ionic-angular';

import { BelaqiSelection, HeaderContent } from '../../components/belaqi-user-location-slider/belaqi-user-location-slider';
import { RefreshHandler } from '../../providers/refresh/refresh';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  public name = 'start';

  public sliderHeaderContent: HeaderContent;

  constructor(
    private nav: NavController,
    private refreshHandler: RefreshHandler,
    private platform: Platform,
    private toast: ToastController,
    private translateSrvc: TranslateService
  ) { }

  public navigateToMap(selection: BelaqiSelection) {
    this.nav.push(MapPage, { belaqiSelection: selection });
  }

  public setHeaderContent(headerContent: HeaderContent) {
    this.sliderHeaderContent = headerContent;
  }

  public handleOnSticky(event: IonAffixEvent) {
    if (event.sticky) {
      event.affix.headerElement.classList.add('ion-affix');
    } else {
      event.affix.headerElement.classList.remove('ion-affix');
    }
    if (!event.sticky && this.sliderHeaderContent === null) {
      event.affix.headerElement.remove();
    }
  }

  public doRefresh(refresher: Refresher) {
    this.refreshHandler.refresh();
    if (this.platform.is('cordova')) {
      this.toast.create({
        message: this.translateSrvc.instant('refresh-button.message'),
        duration: 3000
      }).present();
    }
    setTimeout(() => refresher.complete(), 1000);
  }

}
