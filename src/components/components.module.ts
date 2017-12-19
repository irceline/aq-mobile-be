import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandMapSelectorModule } from 'helgoland-toolbox';
import { IonicModule } from 'ionic-angular';

import { MobileGeosearchControlComponent } from './mobile-geosearch-control/mobile-geosearch-control';
import { MobileExtentControlComponent } from './mobile-extent-control/mobile-extent-control';
import { MobileLocateControlComponent } from './mobile-locate-control/mobile-locate-control';

@NgModule({
	declarations: [
		MobileGeosearchControlComponent,
		MobileExtentControlComponent,
		MobileLocateControlComponent
	],
	imports: [
		HelgolandMapSelectorModule,
		CommonModule,
		FormsModule,
		IonicModule
	],
	exports: [
		MobileGeosearchControlComponent,
		MobileExtentControlComponent,
		MobileLocateControlComponent
	]
})
export class ComponentsModule { }
