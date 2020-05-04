import {NgModule} from '@angular/core';
import {AutoCompleteModule} from 'ionic4-auto-complete';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {LocationPickerComponent} from './location-picker/location-picker.component';

const COMPONENTS = [
    LocationPickerComponent
]

@NgModule({
    imports: [
        AutoCompleteModule,
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    entryComponents: COMPONENTS
})
export class V2ComponentsModule { }
