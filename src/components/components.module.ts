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
import { ClosestMeasuringStationPanelComponent } from './closest-measuring-station-panel/closest-measuring-station-panel';
import {
	ClosestMeasuringStationPanelEntryComponent,
} from './closest-measuring-station-panel/closest-measuring-station-panel-entry';
import {
	MobileDatasetByStationSelectorComponent,
} from './dataset-by-station-selector/dataset-by-station-selector.component';
import { ForecastMapComponent } from './forecast-map/forecast-map';
import { LocatedValueNotificationComponent } from './located-value-notification/located-value-notification';
import { MobileExtentControlComponent } from './mobile-extent-control/mobile-extent-control';
import { MobileGeosearchControlComponent } from './mobile-geosearch-control/mobile-geosearch-control';
import { MobileLocateControlComponent } from './mobile-locate-control/mobile-locate-control';
import { MobilePhenomenonSelectorComponent } from './mobile-phenomenon-selector/mobile-phenomenon-selector';
import { MobileTimeseriesEntryComponent } from './mobile-timeseries-entry/mobile-timeseries-entry';
import { MobileTimespanButtonComponent } from './mobile-timespan-button/mobile-timespan-button';
import { MobileTimespanShiftSelectorComponent } from './mobile-timespan-shift-selector/mobile-timespan-shift-selector';
import { ModalGeometryViewerComponent } from './modal-geometry-viewer/modal-geometry-viewer';
import { ModalLegendComponent } from './modal-legend/modal-legend';
import { ModalOptionsEditorComponent } from './modal-options-editor/modal-options-editor';
import { ModalTimespanEditorComponent } from './modal-timespan-editor/modal-timespan-editor';
import { NetworkPanelComponent } from './network-panel/network-panel';
import { PhenomenonSelectorPopoverComponent } from './phenomenon-selector-popover/phenomenon-selector-popover';
import { PushNotificationComponent } from './push-notification/push-notification';
import { RefreshButtonComponent } from './refresh-button/refresh-button';
import { StationSelectorComponent } from './station-selector/station-selector';
import { ValuePanelComponent } from './value-panel/value-panel';

@NgModule({
	declarations: [
		MobileGeosearchControlComponent,
		MobileExtentControlComponent,
		MobileLocateControlComponent,
		StationSelectorComponent,
		MobileDatasetByStationSelectorComponent,
		MobileTimespanShiftSelectorComponent,
		ModalTimespanEditorComponent,
		MobileTimespanButtonComponent,
		ModalLegendComponent,
		MobileTimeseriesEntryComponent,
		ModalGeometryViewerComponent,
		ModalOptionsEditorComponent,
		PhenomenonSelectorPopoverComponent,
		MobilePhenomenonSelectorComponent,
		ForecastMapComponent,
		AirQualityIndexComponent,
		PushNotificationComponent,
		ValuePanelComponent,
		LocatedValueNotificationComponent,
		RefreshButtonComponent,
		NetworkPanelComponent,
		ClosestMeasuringStationPanelComponent,
		ClosestMeasuringStationPanelEntryComponent,
		AirQualityLocationPanelComponent
	],
	imports: [
		HelgolandMapViewModule,
		HelgolandLabelMapperModule,
		HelgolandModificationModule,
		HelgolandSelectorModule,
		CommonModule,
		FormsModule,
		IonicModule,
		TranslateModule.forChild()
	],
	exports: [
		MobileGeosearchControlComponent,
		MobileExtentControlComponent,
		MobileLocateControlComponent,
		StationSelectorComponent,
		MobileDatasetByStationSelectorComponent,
		MobileTimespanShiftSelectorComponent,
		ModalTimespanEditorComponent,
		MobileTimespanButtonComponent,
		ModalLegendComponent,
		MobileTimeseriesEntryComponent,
		ModalGeometryViewerComponent,
		ModalOptionsEditorComponent,
		PhenomenonSelectorPopoverComponent,
		MobilePhenomenonSelectorComponent,
		ForecastMapComponent,
		AirQualityIndexComponent,
		PushNotificationComponent,
		ValuePanelComponent,
		LocatedValueNotificationComponent,
		RefreshButtonComponent,
		NetworkPanelComponent,
		ClosestMeasuringStationPanelComponent,
		ClosestMeasuringStationPanelEntryComponent,
		AirQualityLocationPanelComponent
	],
	entryComponents: [
		StationSelectorComponent,
		ModalTimespanEditorComponent,
		ModalLegendComponent,
		ModalGeometryViewerComponent,
		ModalOptionsEditorComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		LocatedValueNotificationComponent
	]
})
export class ComponentsModule { }
