import {NgModule} from '@angular/core';
import {AutoCompleteModule} from 'ionic4-auto-complete';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {IntroScreenComponent} from './intro-screen/intro-screen.component';
import {V2ComponentsModule} from '../components/v2-components.module';

const SCREENS = [
    IntroScreenComponent
];

@NgModule({
    imports: [
        AutoCompleteModule,
        CommonModule,
        FormsModule,
        IonicModule,
        V2ComponentsModule,
    ],
    declarations: SCREENS,
    exports: SCREENS,
    entryComponents: SCREENS
})
export class V2ScreensModule { }
