import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { AnnualMeanPanelEntryComponent } from './annual-mean-panel/annual-mean-panel-entry.component';
import { AnnualMeanPanelInformationPopupComponent } from './annual-mean-panel/annual-mean-panel-information-popup.component';
import { AnnualMeanPanelComponent } from './annual-mean-panel/annual-mean-panel.component';
import { BelaqiChartInformationComponent } from './belaqi-chart/belaqi-chart-information.component';
import { BelaqiChartComponent } from './belaqi-chart/belaqi-chart.component';
import { BelaqiUserLocationSliderComponent } from './belaqi-user-location-slider/belaqi-user-location-slider.component';
import { BelaqiWheelInformationComponent } from './belaqi-wheel/belaqi-wheel-information.component';
import { BelaqiWheelComponent } from './belaqi-wheel/belaqi-wheel.component';
import {
  NearestMeasuringStationPanelEntryComponent,
} from './nearest-measuring-station-panel/nearest-measuring-station-panel-entry.component';
import {
  NearestMeasuringStationPanelInformationPopupComponent,
} from './nearest-measuring-station-panel/nearest-measuring-station-panel-information-popup.component';
import {
  NearestMeasuringStationPanelComponent,
} from './nearest-measuring-station-panel/nearest-measuring-station-panel.component';
import { NotificationIconPopupComponent } from './notification-icon/notification-icon-popup.component';
import { NotificationIconComponent } from './notification-icon/notification-icon.component';
import { PushNotificationComponent } from './push-notification/push-notification.component';
import { SubIndexPanelEntryComponent } from './sub-index-panel/sub-index-panel-entry.component';
import { SubIndexPanelInformationPopupComponent } from './sub-index-panel/sub-index-panel-information-popup.component';
import { SubIndexPanelComponent } from './sub-index-panel/sub-index-panel.component';

const COMPONENTS = [
  AnnualMeanPanelComponent,
  AnnualMeanPanelEntryComponent,
  NearestMeasuringStationPanelEntryComponent,
  AnnualMeanPanelInformationPopupComponent,
  BelaqiChartComponent,
  NearestMeasuringStationPanelInformationPopupComponent,
  BelaqiChartInformationComponent,
  BelaqiUserLocationSliderComponent,
  BelaqiWheelComponent,
  BelaqiWheelInformationComponent,
  NearestMeasuringStationPanelComponent,
  NotificationIconComponent,
  NotificationIconPopupComponent,
  PushNotificationComponent,
  SubIndexPanelComponent,
  SubIndexPanelEntryComponent,
  SubIndexPanelInformationPopupComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HelgolandCoreModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents: COMPONENTS
})
export class ComponentsModule { }
