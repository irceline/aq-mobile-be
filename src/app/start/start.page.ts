import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import {
  BelaqiSelection,
  BelaqiUserLocationSliderComponent,
} from '../components/belaqi-user-location-slider/belaqi-user-location-slider.component';
import { DrawerState } from '../components/overlay-info-drawer/overlay-info-drawer';
import { ModalIntroComponent } from '../components/settings/modal-intro/modal-intro.component';
import { HeaderContent } from '../components/slider-header/slider-header.component';
import { MapDataService } from '../services/map-data/map-data.service';
import { RefreshHandler } from '../services/refresh/refresh.service';

@Component({
  selector: 'start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  dockedHeight = 92;
  drawerState = DrawerState.Docked;
  states = DrawerState;

  @ViewChild('slider')
  private sliderComponent: BelaqiUserLocationSliderComponent;

  public sliderHeader: HeaderContent;

  constructor(
    private translateSrvc: TranslateService,
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

  public ionViewDidEnter() {
    this.sliderComponent.gotToFirstSlide();
  }

  public navigateToMap(selection: BelaqiSelection) {
    this.mapDataService.selection = selection;
    this.router.navigate(['tabs/map']);
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
