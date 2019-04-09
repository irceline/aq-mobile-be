import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { ModalSettingsComponent } from '../settings/modal-settings/modal-settings.component';

export interface HeaderContent {
  label: string;
  date: Date;
  current: boolean;
}

@Component({
  selector: 'slider-header',
  templateUrl: './slider-header.component.html',
  styleUrls: ['./slider-header.component.scss'],
})
export class SliderHeaderComponent implements OnInit {

  @Input()
  public header: HeaderContent;

  constructor(
    public translateSrvc: TranslateService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() { }

  public setHeaderContent(headerContent: HeaderContent) {
    let visibility;
    if (headerContent) {
      visibility = 'inherit';
    } else {
      visibility = 'hidden';
    }
    const locationHeaderElems = document.querySelectorAll('.location-header');
    for (let i = 0; i < locationHeaderElems.length; i++) {
      (locationHeaderElems[i] as HTMLElement).style.visibility = visibility;
    }
  }

  public navigateSettings() {
    this.modalCtrl.create({ component: ModalSettingsComponent }).then(modal => modal.present());
  }

}
