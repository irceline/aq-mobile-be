import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BelaqiMapSliderComponent } from '../components/belaqi-map-slider/belaqi-map-slider.component';
import { HeaderContent } from '../components/slider-header/slider-header.component';
import { AnalyticsService } from '../services/analytics/analytics.service';
import { RefreshHandler } from '../services/refresh/refresh.service';
import { ToastController, Platform } from '@ionic/angular';

@Component({
  selector: 'map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild('slider')
  private sliderComponent: BelaqiMapSliderComponent;

  public sliderHeader: HeaderContent;

  constructor(
    public translateSrvc: TranslateService,
    private analytics: AnalyticsService,
    private platform: Platform,
    private toast: ToastController,
    private refreshHandler: RefreshHandler
  ) { }

  public ngOnInit(): void {
    this.sliderComponent.changeToMap();
  }

  public ionViewDidEnter() {
    this.sliderComponent.changeToMap();
    this.analytics.logEvent('open_map');
  }

  public async doRefresh(event) {
    this.refreshHandler.refresh();
    if (this.platform.is('cordova')) {
      const toast = await this.toast.create({ message: this.translateSrvc.instant('refresh-button.message'), duration: 3000 });
      toast.present();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

}
