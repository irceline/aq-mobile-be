import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonAffixEvent } from 'ion-affix/dist/directives/ion-affix-event';
import { NavController } from 'ionic-angular';

import { BelaqiSelection, HeaderContent } from '../../components/belaqi-user-location-slider/belaqi-user-location-slider';
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
    public translateSrvc: TranslateService
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

}
