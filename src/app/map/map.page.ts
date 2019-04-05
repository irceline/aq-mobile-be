import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { BelaqiMapSliderComponent, HeaderContent } from '../components/belaqi-map-slider/belaqi-map-slider.component';
import { DrawerState } from '../components/overlay-info-drawer/overlay-info-drawer';
import { ModalSettingsComponent } from '../components/settings/modal-settings/modal-settings.component';
import { AnalyticsService } from '../services/analytics/analytics.service';

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
    private modalCtrl: ModalController,
    private analytics: AnalyticsService,
  ) { }

  public ngOnInit(): void {
    this.sliderComponent.changeToMap();
  }

  public ionViewDidEnter() {
    this.sliderComponent.changeToMap();
    this.analytics.logEvent('open_map');
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

  public navigateSettings() {
    this.modalCtrl.create({ component: ModalSettingsComponent }).then(modal => modal.present());
  }

}
