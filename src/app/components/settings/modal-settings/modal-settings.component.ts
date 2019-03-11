import { Component } from '@angular/core';
import { Language, SettingsService } from '@helgoland/core';
import { ModalController } from '@ionic/angular';

import { MobileSettings } from '../../../services/settings/settings.service';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.scss'],
})
export class ModalSettingsComponent {

  public languageList: Language[];

  constructor(
    private settings: SettingsService<MobileSettings>,
    private modalCtrl: ModalController
  ) {
    this.languageList = this.settings.getSettings().languages;
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }

}
