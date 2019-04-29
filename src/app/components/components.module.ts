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
import { BelaqiDiagramSliderComponent } from './belaqi-diagram-slider/belaqi-diagram-slider.component';
import { BelaqiMapSliderComponent } from './belaqi-map-slider/belaqi-map-slider.component';
import { BelaqiUserLocationSliderComponent } from './belaqi-user-location-slider/belaqi-user-location-slider.component';
import { BelaqiWheelInformationComponent } from './belaqi-wheel/belaqi-wheel-information.component';
import { BelaqiWheelComponent } from './belaqi-wheel/belaqi-wheel.component';
import {
  CustomizedStationMapSelectorComponent,
} from './customized-station-map-selector/customized-station-map-selector.component';
import { ExtendedGeometryMapViewerComponent } from './extended-geometry-map-viewer/extended-geometry-map-viewer.component';
import { GeolocationEnabledComponent } from './geolocation-enabled/geolocation-enabled.component';
import { LastSlideComponent } from './last-slide/last-slide.component';
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
import { NotificationPanelComponent } from './notification-panel/notification-panel.component';
import { NotificationPopupComponent } from './notification-panel/notification-popup.component';
import { OverlayInfoDrawerComponent } from './overlay-info-drawer/overlay-info-drawer';
import { AboutSettingsComponent } from './settings/about-settings/about-settings.component';
import { CommonSettingsComponent } from './settings/common-settings/common-settings.component';
import { ModalIntroComponent } from './settings/modal-intro/modal-intro.component';
import { ModalSettingsComponent } from './settings/modal-settings/modal-settings.component';
import {
  PushNotificationSubscriptionsSettingsComponent,
} from './settings/push-notification-subscriptions-settings/push-notification-subscriptions-settings.component';
import { StartPageSettingsComponent } from './settings/start-page-settings/start-page-settings.component';
import { UserLocationsSettingsComponent } from './settings/user-locations-settings/user-locations-settings.component';
import { SingleChartComponent } from './single-chart/single-chart.component';
import { SliderHeaderComponent } from './slider-header/slider-header.component';
import { SubIndexPanelEntryComponent } from './sub-index-panel/sub-index-panel-entry.component';
import { SubIndexPanelInformationPopupComponent } from './sub-index-panel/sub-index-panel-information-popup.component';
import { SubIndexPanelComponent } from './sub-index-panel/sub-index-panel.component';
import { UserLocationCreationComponent } from './user-location-creation/user-location-creation.component';

const COMPONENTS = [
  AboutSettingsComponent,
  AnnualMeanPanelComponent,
  AnnualMeanPanelEntryComponent,
  AnnualMeanPanelInformationPopupComponent,
  BelaqiChartComponent,
  BelaqiChartInformationComponent,
  BelaqiDiagramSliderComponent,
  BelaqiMapSliderComponent,
  BelaqiUserLocationSliderComponent,
  BelaqiWheelComponent,
  BelaqiWheelInformationComponent,
  CommonSettingsComponent,
  CustomizedStationMapSelectorComponent,
  ExtendedGeometryMapViewerComponent,
  GeolocationEnabledComponent,
  LastSlideComponent,
  LocationSelectionComponent,
  MobileGeosearchControlComponent,
  ModalEditUserLocationComponent,
  ModalIntroComponent,
  ModalSettingsComponent,
  ModalSettingsComponent,
  ModalUserLocationCreationComponent,
  ModalUserLocationListComponent,
  NearestMeasuringStationPanelComponent,
  NearestMeasuringStationPanelEntryComponent,
  NearestMeasuringStationPanelInformationPopupComponent,
  NotificationPopupComponent,
  NotificationPanelComponent,
  OverlayInfoDrawerComponent,
  PushNotificationSubscriptionsSettingsComponent,
  SingleChartComponent,
  SliderHeaderComponent,
  StartPageSettingsComponent,
  SubIndexPanelComponent,
  SubIndexPanelEntryComponent,
  SubIndexPanelInformationPopupComponent,
  UserLocationCreationComponent,
  UserLocationsSettingsComponent,
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
