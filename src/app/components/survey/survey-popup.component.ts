import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { SurveyService } from './../../services/survey/survey.service';

@Component({
  selector: 'app-survey-popup',
  templateUrl: './survey-popup.component.html',
  styleUrls: ['./survey-popup.component.scss'],
})
export class SurveyPopupComponent {

  constructor(
    private ctrl: PopoverController,
    private surveySrvc: SurveyService,
    private iab: InAppBrowser,
    private translate: TranslateService
  ) { }

  public deselect() {
    this.surveySrvc.deactivate();
    this.ctrl.dismiss();
  }

  public openSurvey() {
    // this.iab.create('https://nl.surveymonkey.com/r/VNBBPD6', '_system', 'hidden=yes');
    this.iab.create(this.translate.instant('survey.link'), '_system', 'hidden=yes');
    this.deselect();
  }

  public close() {
    this.ctrl.dismiss();
  }

}
