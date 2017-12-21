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
import { HelgolandSelectorModule } from 'helgoland-toolbox/dist/components/selector/selector.module';
import { IonicModule } from 'ionic-angular';

import {
	MobileDatasetByStationSelectorComponent,
} from './dataset-by-station-selector/dataset-by-station-selector.component';
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
import { PhenomenonSelectorPopoverComponent } from './phenomenon-selector-popover/phenomenon-selector-popover';
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
		ModalOptionsEditorComponent,
		PhenomenonSelectorPopoverComponent,
		MobilePhenomenonSelectorComponent
	],
	imports: [
		HelgolandMapSelectorModule,
		HelgolandDepictionModule,
		HelgolandServicesModule,
		HelgolandDatasetlistModule,
		HelgolandMapViewModule,
		HelgolandSelectorModule,
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
		ModalOptionsEditorComponent,
		PhenomenonSelectorPopoverComponent,
		MobilePhenomenonSelectorComponent
	],
	entryComponents: [
		StationSelectorComponent,
		ModalTimespanEditorComponent,
		ModalLegendComponent,
		ModalGeometryViewerComponent,
		ModalOptionsEditorComponent,
		PhenomenonSelectorPopoverComponent
	]
})
export class ComponentsModule { }
