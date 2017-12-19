import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HelgolandMapSelectorModule } from 'helgoland-toolbox';
import { IonicModule } from 'ionic-angular';

import {
	MobileDatasetByStationSelectorComponent,
} from './dataset-by-station-selector/dataset-by-station-selector.component';
import { MobileExtentControlComponent } from './mobile-extent-control/mobile-extent-control';
import { MobileGeosearchControlComponent } from './mobile-geosearch-control/mobile-geosearch-control';
import { MobileLocateControlComponent } from './mobile-locate-control/mobile-locate-control';
import { StationSelectorComponent } from './station-selector/station-selector';

@NgModule({
	declarations: [
		MobileGeosearchControlComponent,
		MobileExtentControlComponent,
		MobileLocateControlComponent,
		StationSelectorComponent,
		MobileDatasetByStationSelectorComponent
	],
	imports: [
		HelgolandMapSelectorModule,
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
		MobileDatasetByStationSelectorComponent
	],
	entryComponents: [
		StationSelectorComponent
	]
})
export class ComponentsModule { }
