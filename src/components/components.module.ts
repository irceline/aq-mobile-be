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
import { ModalPhenomenonSelectorComponent } from './modal-phenomenon-selector/modal-phenomenon-selector';
import { ModalTimespanEditorComponent } from './modal-timespan-editor/modal-timespan-editor';
import { NearestMeasuringStationPanelComponent } from './nearest-measuring-station-panel/nearest-measuring-station-panel';
import {
	NearestMeasuringStationPanelEntryComponent,
} from './nearest-measuring-station-panel/nearest-measuring-station-panel-entry';
import { NetworkPanelComponent } from './network-panel/network-panel';
import { PhenomenonSelectorPopoverComponent } from './phenomenon-selector-popover/phenomenon-selector-popover';
import { PushNotificationComponent } from './push-notification/push-notification';
import { RefreshButtonComponent } from './refresh-button/refresh-button';
import { StationSelectorComponent } from './station-selector/station-selector';
import { ValuePanelComponent } from './value-panel/value-panel';

@NgModule({
	declarations: [
		AirQualityIndexComponent,
		AirQualityLocationPanelComponent,
		BelaqiChartComponent,
		ForecastMapComponent,
		LocatedValueNotificationComponent,
		MobileDatasetByStationSelectorComponent,
		MobileExtentControlComponent,
		MobileGeosearchControlComponent,
		MobileLocateControlComponent,
		MobilePhenomenonSelectorComponent,
		MobileTimeseriesEntryComponent,
		MobileTimespanButtonComponent,
		MobileTimespanShiftSelectorComponent,
		ModalGeometryViewerComponent,
		ModalLegendComponent,
		ModalOptionsEditorComponent,
		ModalPhenomenonSelectorComponent,
		ModalTimespanEditorComponent,
		NearestMeasuringStationPanelComponent,
		NearestMeasuringStationPanelEntryComponent,
		NetworkPanelComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		RefreshButtonComponent,
		StationSelectorComponent,
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
		ForecastMapComponent,
		LocatedValueNotificationComponent,
		MobileDatasetByStationSelectorComponent,
		MobileExtentControlComponent,
		MobileGeosearchControlComponent,
		MobileLocateControlComponent,
		MobilePhenomenonSelectorComponent,
		MobileTimeseriesEntryComponent,
		MobileTimespanButtonComponent,
		MobileTimespanShiftSelectorComponent,
		ModalGeometryViewerComponent,
		ModalLegendComponent,
		ModalOptionsEditorComponent,
		ModalPhenomenonSelectorComponent,
		ModalTimespanEditorComponent,
		NearestMeasuringStationPanelComponent,
		NearestMeasuringStationPanelEntryComponent,
		NetworkPanelComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		RefreshButtonComponent,
		StationSelectorComponent,
		ValuePanelComponent,
	],
	entryComponents: [
		LocatedValueNotificationComponent,
		ModalGeometryViewerComponent,
		ModalLegendComponent,
		ModalOptionsEditorComponent,
		ModalPhenomenonSelectorComponent,
		ModalTimespanEditorComponent,
		PhenomenonSelectorPopoverComponent,
		PushNotificationComponent,
		StationSelectorComponent,
	]
})
export class ComponentsModule { }
