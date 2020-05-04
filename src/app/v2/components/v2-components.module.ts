import {NgModule} from '@angular/core';
import {AutoCompleteModule} from 'ionic4-auto-complete';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {LocationPickerComponent} from './location-picker/location-picker.component';
import {HeaderComponent} from './header/header.component';
import {CircleChartComponent} from './circle-chart/circle-chart.component';
import {LocationSwipeComponent} from './location-swipe/location-swipe.component';
import {PullTabComponent} from './pull-tab/pull-tab.component';
import {TimeLineItemComponent} from './time-line-item/time-line-item.component';
import {TimeLineListComponent} from './time-line-list/time-line-list.component';
import { OnboardingSliderComponent } from './onboarding-slider/onboarding-slider.component';

const COMPONENTS = [
    CircleChartComponent,
    HeaderComponent,
    LocationPickerComponent,
    LocationSwipeComponent,
    PullTabComponent,
    TimeLineItemComponent,
    TimeLineListComponent,
    OnboardingSliderComponent
];

@NgModule({
    imports: [AutoCompleteModule, CommonModule, FormsModule, IonicModule],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    entryComponents: COMPONENTS,
})
export class V2ComponentsModule {}
