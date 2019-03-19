import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import {
  BelaqiSelection,
  HeaderContent,
} from '../components/belaqi-user-location-slider/belaqi-user-location-slider.component';
import { DrawerState } from '../components/overlay-info-drawer/overlay-info-drawer';
import { ModalIntroComponent } from '../components/settings/modal-intro/modal-intro.component';
import { MapDataService } from '../services/map-data/map-data.service';
import { RefreshHandler } from '../services/refresh/refresh.service';

@Component({
  selector: 'start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  dockedHeight = 107;
  drawerState = DrawerState.Docked;
  states = DrawerState;

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

  public navigateToMap(selection: BelaqiSelection) {
    this.mapDataService.selection = selection;
    this.router.navigate(['tabs/map']);
  }

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

}
