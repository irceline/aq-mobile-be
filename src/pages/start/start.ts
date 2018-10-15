import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonAffixEvent } from 'ion-affix/dist/directives/ion-affix-event';
import { NavController } from 'ionic-angular';

import { HeaderContent } from '../../components/belaqi-user-location-slider/belaqi-user-location-slider';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  public locationCount: number;
  public name = 'start';

  public sliderHeaderContent: HeaderContent;

  constructor(
    private nav: NavController,
    private userLocations: UserLocationListProvider,
    public translateSrvc: TranslateService
  ) {
    this.userLocations.getAllLocations().subscribe(list => this.locationCount = list.length);
  }

  public navigateToMap(phenomenonId: string) {
    this.nav.push(MapPage, { phenomenonId });
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
