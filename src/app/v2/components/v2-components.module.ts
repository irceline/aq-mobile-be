import { NgModule } from '@angular/core';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { CircleChartComponent } from './circle-chart/circle-chart.component';
import { LocationSwipeComponent } from './location-swipe/location-swipe.component';
import { PullTabComponent } from './pull-tab/pull-tab.component';
import { TimeLineItemComponent } from './time-line-item/time-line-item.component';
import { TimeLineListComponent } from './time-line-list/time-line-list.component';
import { OnboardingSliderComponent } from './onboarding-slider/onboarding-slider.component';
import { LanguageDropdownComponent } from './language-dropdown/language-dropdown.component';
import { LocationInputComponent } from './location-input/location-input.component';
import {UserNotificationSettingsComponent} from './user-notification-settings/user-notification-settings.component';
import {TranslateModule} from '@ngx-translate/core';
import {BackgroundComponent} from './background/background.component';

const COMPONENTS = [
    CircleChartComponent,
    HeaderComponent,
    LocationSwipeComponent,
    PullTabComponent,
    TimeLineItemComponent,
    TimeLineListComponent,
    OnboardingSliderComponent,
    LanguageDropdownComponent,
    LocationInputComponent,
    UserNotificationSettingsComponent,
    BackgroundComponent
];

@NgModule({
    imports: [AutoCompleteModule, CommonModule, FormsModule, IonicModule, TranslateModule],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    entryComponents: COMPONENTS,
})
export class V2ComponentsModule {}
