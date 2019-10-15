import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { SurveyService } from '../../services/survey/survey.service';
import { SurveyPopupComponent } from './survey-popup.component';

@Component({
  selector: 'app-survey-button',
  templateUrl: './survey-button.component.html',
  styleUrls: ['./survey-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SurveyComponent implements OnInit {

  public visible: boolean;

  public showText = true;

  constructor(
    private surveySrvc: SurveyService,
    private ctrl: PopoverController
  ) { }

  ngOnInit() {
    this.surveySrvc.active.subscribe(active => this.visible = active);
  }

  public async openSurvey() {
    this.showText = false;
    const modal = await this.ctrl.create({ component: SurveyPopupComponent, cssClass: 'survey-popover' });
    modal.present();
  }

}
