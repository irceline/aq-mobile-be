import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
	HelgolandDatasetlistModule,
	HelgolandDepictionModule,
	HelgolandMapSelectorModule,
	HelgolandMapViewModule,
	HelgolandModificationModule,
	HelgolandServicesModule,
} from 'helgoland-toolbox';
import { IonicModule } from 'ionic-angular';

import {
	MobileDatasetByStationSelectorComponent,
} from './dataset-by-station-selector/dataset-by-station-selector.component';
import { MobileExtentControlComponent } from './mobile-extent-control/mobile-extent-control';
import { MobileGeosearchControlComponent } from './mobile-geosearch-control/mobile-geosearch-control';
import { MobileLocateControlComponent } from './mobile-locate-control/mobile-locate-control';
import { MobileTimeseriesEntryComponent } from './mobile-timeseries-entry/mobile-timeseries-entry';
import { MobileTimespanButtonComponent } from './mobile-timespan-button/mobile-timespan-button';
import { MobileTimespanShiftSelectorComponent } from './mobile-timespan-shift-selector/mobile-timespan-shift-selector';
import { ModalGeometryViewerComponent } from './modal-geometry-viewer/modal-geometry-viewer';
import { ModalLegendComponent } from './modal-legend/modal-legend';
import { ModalOptionsEditorComponent } from './modal-options-editor/modal-options-editor';
import { ModalTimespanEditorComponent } from './modal-timespan-editor/modal-timespan-editor';
import { StationSelectorComponent } from './station-selector/station-selector';

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
		ModalOptionsEditorComponent
	],
	imports: [
		HelgolandMapSelectorModule,
		HelgolandDepictionModule,
		HelgolandServicesModule,
		HelgolandDatasetlistModule,
		HelgolandMapViewModule,
		HelgolandModificationModule,
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
		ModalOptionsEditorComponent
	],
	entryComponents: [
		StationSelectorComponent,
		ModalTimespanEditorComponent,
		ModalLegendComponent,
		ModalGeometryViewerComponent,
		ModalOptionsEditorComponent
	]
})
export class ComponentsModule { }
