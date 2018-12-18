import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';

import { AirQualityIndexComponent } from './air-quality-index/air-quality-index';
import { AirQualityLocationPanelComponent } from './air-quality-location-panel/air-quality-location-panel';
import { AnnualPhenomenonButtonsComponent } from './annual-phenomenon-buttons/annual-phenomenon-buttons';
import { BelaqiChartComponent } from './belaqi-chart/belaqi-chart';
import { BelaqiChartInformationComponent } from './belaqi-chart/belaqi-chart-information';
import { BelaqiLocateDelayedInformationComponent } from './belaqi-user-location-slider/belaqi-locate-delayed-information';
import { BelaqiUserLocationSliderComponent } from './belaqi-user-location-slider/belaqi-user-location-slider';
import { BelaqiWheelComponent } from './belaqi-wheel/belaqi-wheel';
import { BelaqiWheelInformationComponent } from './belaqi-wheel/belaqi-wheel-information';
import { CustomizePersonalAlertsComponent } from './customize-personal-alerts/customize-personal-alerts';
import {
	MobileDatasetByStationSelectorComponent,
} from './dataset-by-station-selector/dataset-by-station-selector.component';
import { ExtendedGeometryMapViewerComponent } from './extended-geometry-map-viewer/extended-geometry-map-viewer';
import { GeolocationEnabledIconComponent } from './geolocation-enabled-icon/geolocation-enabled-icon';
import { GeolocationEnabledIconPopupComponent } from './geolocation-enabled-icon/geolocation-enabled-icon-popup';
import { LocatedValueNotificationComponent } from './located-value-notification/located-value-notification';
import { LocationSelectionComponent } from './location-selection/location-selection';
import { MobileExtentControlComponent } from './mobile-extent-control/mobile-extent-control';
import { MobileGeosearchControlComponent } from './mobile-geosearch-control/mobile-geosearch-control';
import { MobileLocateControlComponent } from './mobile-locate-control/mobile-locate-control';
import { MobilePhenomenonSelectorComponent } from './mobile-phenomenon-selector/mobile-phenomenon-selector';
import { MobileTimeseriesEntryComponent } from './mobile-timeseries-entry/mobile-timeseries-entry';
import { MobileTimespanButtonComponent } from './mobile-timespan-button/mobile-timespan-button';
import { MobileTimespanShiftSelectorComponent } from './mobile-timespan-shift-selector/mobile-timespan-shift-selector';
import { ModalAnnualMapComponent } from './modal-annual-map/modal-annual-map';
import { ModalEditUserLocationComponent } from './modal-edit-user-location/modal-edit-user-location';
import { ModalGeometryViewerComponent } from './modal-geometry-viewer/modal-geometry-viewer';
import { ModalLegendComponent } from './modal-legend/modal-legend';
import { ModalOptionsEditorComponent } from './modal-options-editor/modal-options-editor';
import { ModalPhenomenonSelectorComponent } from './modal-phenomenon-selector/modal-phenomenon-selector';
import { ModalTimespanEditorComponent } from './modal-timespan-editor/modal-timespan-editor';
import { ModalUserLocationCreationComponent } from './modal-user-location-creation/modal-user-location-creation';
import { ModalUserLocationListComponent } from './modal-user-location-list/modal-user-location-list';
import { NearestMeasuringStationPanelComponent } from './nearest-measuring-station-panel/nearest-measuring-station-panel';
import {
	NearestMeasuringStationPanelEntryComponent,
} from './nearest-measuring-station-panel/nearest-measuring-station-panel-entry';
import {
	NearestMeasuringStationPanelInformationPopupComponent,
} from './nearest-measuring-station-panel/nearest-measuring-station-panel-information-popup';
import { NearestSeriesLegendSliderComponent } from './nearest-series-legend-slider/nearest-series-legend-slider';
import { NetworkPanelComponent } from './network-panel/network-panel';
import { NotificationIconComponent } from './notification-icon/notification-icon';
import { NotificationIconPopupComponent } from './notification-icon/notification-icon-popup';
import { PhenomenonSelectorPopoverComponent } from './phenomenon-selector-popover/phenomenon-selector-popover';
import { PushNotificationSubscriptionsComponent } from './push-notification-subscriptions/push-notification-subscriptions';
import { PushNotificationComponent } from './push-notification/push-notification';
import { RefreshButtonComponent } from './refresh-button/refresh-button';
import { SimpleLegendEntryComponent } from './simple-legend-entry/simple-legend-entry';
import { StationSelectorComponent } from './station-selector/station-selector';
import { UserLocationCreationComponent } from './user-location-creation/user-location-creation';

@NgModule({
	declarations: [
		AirQualityIndexComponent,
		AirQualityLocationPanelComponent,
		AnnualPhenomenonButtonsComponent,
		BelaqiChartComponent,
		BelaqiChartInformationComponent,
		BelaqiLocateDelayedInformationComponent,
		BelaqiUserLocationSliderComponent,
		BelaqiWheelComponent,
		BelaqiWheelInformationComponent,
		CustomizePersonalAlertsComponent,
		ExtendedGeometryMapViewerComponent,
		GeolocationEnabledIconComponent,
		GeolocationEnabledIconPopupComponent,
		LocatedValueNotificationComponent,
		LocationSelectionComponent,
		MobileDatasetByStationSelectorComponent,
		MobileExtentControlComponent,
		MobileGeosearchControlComponent,
		MobileLocateControlComponent,
		MobilePhenomenonSelectorComponent,
		MobileTimeseriesEntryComponent,
		MobileTimespanButtonComponent,
		MobileTimespanShiftSelectorComponent,
		ModalAnnualMapComponent,
		ModalEditUserLocationComponent,
		ModalGeometryViewerComponent,
		ModalLegendComponent,
		ModalOptionsEditorComponent,
		ModalPhenomenonSelectorComponent,
		ModalTimespanEditorComponent,
		ModalUserLocationCreationComponent,
		ModalUserLocationListComponent,
		NearestMeasuringStationPanelComponent,
		NearestMeasuringStationPanelEntryComponent,
		NearestMeasuringStationPanelInformationPopupComponent,
		NearestSeriesLegendSliderComponent,
		NetworkPanelComponent,
		NotificationIconComponent,
		NotificationIconPopupComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		PushNotificationSubscriptionsComponent,
		RefreshButtonComponent,
		SimpleLegendEntryComponent,
		StationSelectorComponent,
		UserLocationCreationComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		HelgolandLabelMapperModule,
		HelgolandMapViewModule,
		HelgolandModificationModule,
		HelgolandSelectorModule,
		IonicModule,
		TranslateModule.forChild()
	],
	exports: [
		AirQualityIndexComponent,
		AirQualityLocationPanelComponent,
		AnnualPhenomenonButtonsComponent,
		BelaqiChartComponent,
		BelaqiChartInformationComponent,
		BelaqiLocateDelayedInformationComponent,
		BelaqiUserLocationSliderComponent,
		BelaqiWheelComponent,
		BelaqiWheelInformationComponent,
		CustomizePersonalAlertsComponent,
		ExtendedGeometryMapViewerComponent,
		GeolocationEnabledIconComponent,
		GeolocationEnabledIconPopupComponent,
		LocatedValueNotificationComponent,
		LocationSelectionComponent,
		MobileDatasetByStationSelectorComponent,
		MobileExtentControlComponent,
		MobileGeosearchControlComponent,
		MobileLocateControlComponent,
		MobilePhenomenonSelectorComponent,
		MobileTimeseriesEntryComponent,
		MobileTimespanButtonComponent,
		MobileTimespanShiftSelectorComponent,
		ModalAnnualMapComponent,
		ModalEditUserLocationComponent,
		ModalGeometryViewerComponent,
		ModalLegendComponent,
		ModalOptionsEditorComponent,
		ModalPhenomenonSelectorComponent,
		ModalTimespanEditorComponent,
		ModalUserLocationCreationComponent,
		ModalUserLocationListComponent,
		NearestMeasuringStationPanelComponent,
		NearestMeasuringStationPanelEntryComponent,
		NearestMeasuringStationPanelInformationPopupComponent,
		NearestSeriesLegendSliderComponent,
		NetworkPanelComponent,
		NotificationIconComponent,
		NotificationIconPopupComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		PushNotificationSubscriptionsComponent,
		RefreshButtonComponent,
		SimpleLegendEntryComponent,
		StationSelectorComponent,
		UserLocationCreationComponent,
	],
	entryComponents: [
		BelaqiChartInformationComponent,
		BelaqiWheelInformationComponent,
		GeolocationEnabledIconPopupComponent,
		LocatedValueNotificationComponent,
		ModalAnnualMapComponent,
		ModalEditUserLocationComponent,
		ModalGeometryViewerComponent,
		ModalLegendComponent,
		ModalOptionsEditorComponent,
		ModalPhenomenonSelectorComponent,
		ModalTimespanEditorComponent,
		ModalUserLocationCreationComponent,
		ModalUserLocationListComponent,
		NearestMeasuringStationPanelInformationPopupComponent,
		NotificationIconPopupComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		StationSelectorComponent,
	]
})
export class ComponentsModule { }
