import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandMapModule } from '@helgoland/map';
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
import { ExtendedGeometryMapViewerComponent } from './extended-geometry-map-viewer/extended-geometry-map-viewer.component';
import { LocationSelectionComponent } from './location-selection/location-selection.component';
import { MobileGeosearchControlComponent } from './mobile-geosearch-control/mobile-geosearch-control.component';
import { ModalEditUserLocationComponent } from './modal-edit-user-location/modal-edit-user-location.component';
import { ModalUserLocationCreationComponent } from './modal-user-location-creation/modal-user-location-creation.component';
import { ModalUserLocationListComponent } from './modal-user-location-list/modal-user-location-list.component';
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
import { UserLocationCreationComponent } from './user-location-creation/user-location-creation.component';

const COMPONENTS = [
  AnnualMeanPanelComponent,
  AnnualMeanPanelEntryComponent,
  AnnualMeanPanelInformationPopupComponent,
  BelaqiChartComponent,
  BelaqiChartInformationComponent,
  BelaqiUserLocationSliderComponent,
  BelaqiWheelComponent,
  BelaqiWheelInformationComponent,
  ExtendedGeometryMapViewerComponent,
  LocationSelectionComponent,
  MobileGeosearchControlComponent,
  ModalEditUserLocationComponent,
  ModalUserLocationCreationComponent,
  ModalUserLocationListComponent,
  NearestMeasuringStationPanelComponent,
  NearestMeasuringStationPanelEntryComponent,
  NearestMeasuringStationPanelInformationPopupComponent,
  NotificationIconComponent,
  NotificationIconPopupComponent,
  PushNotificationComponent,
  SubIndexPanelComponent,
  SubIndexPanelEntryComponent,
  SubIndexPanelInformationPopupComponent,
  UserLocationCreationComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HelgolandCoreModule,
    HelgolandMapModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents: COMPONENTS
})
export class ComponentsModule { }
