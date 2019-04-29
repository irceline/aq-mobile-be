import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BelaqiMapSliderComponent } from '../components/belaqi-map-slider/belaqi-map-slider.component';
import { HeaderContent } from '../components/slider-header/slider-header.component';
import { AnalyticsService } from '../services/analytics/analytics.service';

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
  ) { }

  public ngOnInit(): void {
    this.sliderComponent.changeToMap();
  }

  public ionViewDidEnter() {
    this.sliderComponent.changeToMap();
    this.analytics.logEvent('open_map');
  }

}
