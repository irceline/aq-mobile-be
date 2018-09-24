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
import { BelaqiChartComponent } from './belaqi-chart/belaqi-chart';
import { BelaqiUserLocationSliderComponent } from './belaqi-user-location-slider/belaqi-user-location-slider';
import { BelaqiWheelComponent } from './belaqi-wheel/belaqi-wheel';
import { CustomizePersonalAlertsComponent } from './customize-personal-alerts/customize-personal-alerts';
import {
	MobileDatasetByStationSelectorComponent,
} from './dataset-by-station-selector/dataset-by-station-selector.component';
import { ExtendedGeometryMapViewerComponent } from './extended-geometry-map-viewer/extended-geometry-map-viewer';
import { LocatedValueNotificationComponent } from './located-value-notification/located-value-notification';
import { LocationSelectionComponent } from './location-selection/location-selection';
import { MobileExtentControlComponent } from './mobile-extent-control/mobile-extent-control';
import { MobileGeosearchControlComponent } from './mobile-geosearch-control/mobile-geosearch-control';
import { MobileLocateControlComponent } from './mobile-locate-control/mobile-locate-control';
import { MobilePhenomenonSelectorComponent } from './mobile-phenomenon-selector/mobile-phenomenon-selector';
import { MobileTimeseriesEntryComponent } from './mobile-timeseries-entry/mobile-timeseries-entry';
import { MobileTimespanButtonComponent } from './mobile-timespan-button/mobile-timespan-button';
import { MobileTimespanShiftSelectorComponent } from './mobile-timespan-shift-selector/mobile-timespan-shift-selector';
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
import { NearestSeriesLegendSliderComponent } from './nearest-series-legend-slider/nearest-series-legend-slider';
import { NetworkPanelComponent } from './network-panel/network-panel';
import { PhenomenonSelectorPopoverComponent } from './phenomenon-selector-popover/phenomenon-selector-popover';
import { PushNotificationSubscriptionsComponent } from './push-notification-subscriptions/push-notification-subscriptions';
import { PushNotificationComponent } from './push-notification/push-notification';
import { RefreshButtonComponent } from './refresh-button/refresh-button';
import { SimpleLegendEntryComponent } from './simple-legend-entry/simple-legend-entry';
import { StationSelectorComponent } from './station-selector/station-selector';
import { UserLocationCreationComponent } from './user-location-creation/user-location-creation';
import { ValuePanelComponent } from './value-panel/value-panel';

@NgModule({
	declarations: [
		AirQualityIndexComponent,
		AirQualityLocationPanelComponent,
		BelaqiChartComponent,
		BelaqiUserLocationSliderComponent,
		BelaqiWheelComponent,
		CustomizePersonalAlertsComponent,
		ExtendedGeometryMapViewerComponent,
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
		NearestSeriesLegendSliderComponent,
		NetworkPanelComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		PushNotificationSubscriptionsComponent,
		RefreshButtonComponent,
		SimpleLegendEntryComponent,
		StationSelectorComponent,
		UserLocationCreationComponent,
		ValuePanelComponent,
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
		BelaqiChartComponent,
		BelaqiUserLocationSliderComponent,
		BelaqiWheelComponent,
		CustomizePersonalAlertsComponent,
		ExtendedGeometryMapViewerComponent,
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
		NearestSeriesLegendSliderComponent,
		NetworkPanelComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		PushNotificationSubscriptionsComponent,
		RefreshButtonComponent,
		SimpleLegendEntryComponent,
		StationSelectorComponent,
		UserLocationCreationComponent,
		ValuePanelComponent,
	],
	entryComponents: [
		LocatedValueNotificationComponent,
		ModalEditUserLocationComponent,
		ModalGeometryViewerComponent,
		ModalLegendComponent,
		ModalOptionsEditorComponent,
		ModalPhenomenonSelectorComponent,
		ModalTimespanEditorComponent,
		ModalUserLocationCreationComponent,
		ModalUserLocationListComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		StationSelectorComponent,
	]
})
export class ComponentsModule { }
