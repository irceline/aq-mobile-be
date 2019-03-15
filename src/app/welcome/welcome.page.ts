import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import {
  BelaqiSelection,
  HeaderContent,
} from '../components/belaqi-user-location-slider/belaqi-user-location-slider.component';
import { ModalIntroComponent } from '../components/settings/modal-intro/modal-intro.component';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  public sliderHeaderContent: HeaderContent;

  constructor(
    public translateSrvc: TranslateService,
    private storage: Storage,
    private modalCtrl: ModalController,
  ) { }

  public ngOnInit(): void {
/*     this.checkToShowIntroduction(); */
  }

/*   public navigateToMap(selection: BelaqiSelection) {
    this.mapDataService.selection = selection;
    this.router.navigate(['tabs/map']);
  } */

  private checkToShowIntroduction() {
    const firstStartKey = 'firstTimeStarted';
    this.storage.get(firstStartKey).then(value => {
      if (value === null) {
        this.modalCtrl.create({ component: ModalIntroComponent }).then(modal => modal.present());
        this.storage.set(firstStartKey, true);
      }
    });
  }

}
