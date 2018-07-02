import { Component } from '@angular/core';
import { LocalSelectorComponent } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { IntroPage } from '../../intro/intro';

@Component({
  selector: 'common-settings',
  templateUrl: 'common-settings.html'
})
export class CommonSettingsComponent extends LocalSelectorComponent {

  constructor(
    public translate: TranslateService,
    public nav: NavController
  ) {
    super(translate)
  }

  public openIntroduction() {
    this.nav.push(IntroPage);
  }

}
