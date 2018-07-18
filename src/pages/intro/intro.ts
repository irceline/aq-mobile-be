import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard, NavController, Slides } from 'ionic-angular';

import { StartPage } from '../start/start';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @ViewChild(Slides) slides: Slides;

  public selectedLang: string;

  constructor(
    protected navCtrl: NavController,
    protected translate: TranslateService,
    protected keyboard: Keyboard
  ) {
    this.selectedLang = this.translate.currentLang;
  }

  public nextSlide() {
    this.slides.slideTo(this.slides.getActiveIndex() + 1, 500);
  }

  public closeSlides() {
    this.navCtrl.setRoot(StartPage);
  }

  public languageChanged(lang: string) {
    this.translate.use(lang);
  }

  public closeKeyboard() {
    this.keyboard.close();
  }

}
