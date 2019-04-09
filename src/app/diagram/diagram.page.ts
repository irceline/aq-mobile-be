import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { ModalSettingsComponent } from '../components/settings/modal-settings/modal-settings.component';
import { HeaderContent } from '../model/ui';

@Component({
  selector: 'diagram',
  templateUrl: './diagram.page.html',
  styleUrls: ['./diagram.page.scss'],
})
export class DiagramPage implements OnInit {

  public sliderHeaderContent: HeaderContent;

  constructor(
    public translateSrvc: TranslateService,
    private modalCtrl: ModalController
  ) { }

  public ngOnInit() { }

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

  public navigateSettings() {
    this.modalCtrl.create({ component: ModalSettingsComponent }).then(modal => modal.present());
  }

}
