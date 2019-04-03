import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import {
  HeaderContent,
  BelaqiMapSliderComponent,
} from '../components/belaqi-map-slider/belaqi-map-slider.component';
import { DrawerState } from '../components/overlay-info-drawer/overlay-info-drawer';
import { ModalIntroComponent } from '../components/settings/modal-intro/modal-intro.component';
import { ModalSettingsComponent } from '../components/settings/modal-settings/modal-settings.component';
import { MapDataService } from '../services/map-data/map-data.service';
import { RefreshHandler } from '../services/refresh/refresh.service';

@Component({
  selector: 'map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  dockedHeight = 92;
  drawerState = DrawerState.Docked;
  states = DrawerState;

  @ViewChild('slider')
  private sliderComponent: BelaqiMapSliderComponent;

  public sliderHeaderContent: HeaderContent;

  constructor(
    public translateSrvc: TranslateService,
    private storage: Storage,
    private refreshHandler: RefreshHandler,
    private modalCtrl: ModalController,
    private platform: Platform,
    private toast: ToastController,
    private router: Router,
    private mapDataService: MapDataService
  ) { }

  public ngOnInit(): void {
    this.checkToShowIntroduction();
  }

/*   public ionViewDidEnter() {
    this.sliderComponent.gotToFirstSlide();
  } */

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

  public async doRefresh(event) {
    this.refreshHandler.refresh();
    if (this.platform.is('cordova')) {
      const toast = await this.toast.create({ message: this.translateSrvc.instant('refresh-button.message'), duration: 3000 });
      toast.present();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

  private checkToShowIntroduction() {
    const firstStartKey = 'firstTimeStarted';
    this.storage.get(firstStartKey).then(value => {
      if (value === null) {
        this.modalCtrl.create({ component: ModalIntroComponent }).then(modal => modal.present());
        this.storage.set(firstStartKey, true);
      }
    });
  }

  public navigateSettings() {
    this.modalCtrl.create({ component: ModalSettingsComponent }).then(modal => modal.present());
  }

}
