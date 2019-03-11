import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSlides, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'modal-intro',
  templateUrl: './modal-intro.component.html',
  styleUrls: ['./modal-intro.component.scss'],
})
export class ModalIntroComponent implements AfterViewInit {

  @ViewChild(IonSlides) slides: IonSlides;

  public selectedLang: string;

  public isBeginning: boolean;
  public isEnd: boolean;

  constructor(
    protected modalCtrl: ModalController,
    protected translate: TranslateService,
    protected keyboard: Keyboard
  ) {
    this.selectedLang = this.translate.currentLang;
  }

  public ngAfterViewInit(): void {
    this.checkSlides();
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }

  public nextSlide() {
    this.slides.slideNext(500).then(() => this.checkSlides());
  }

  public prevSlide() {
    this.slides.slidePrev(500).then(() => this.checkSlides());
  }

  private checkSlides() {
    this.slides.isBeginning().then(res => this.isBeginning = res);
    this.slides.isEnd().then(res => this.isEnd = res);
  }

  public closeSlides() {
    this.modalCtrl.dismiss();
  }

  public languageChanged(lang: string) {
    this.translate.use(lang);
  }

  public closeKeyboard() {
    this.keyboard.hide();
  }

}
