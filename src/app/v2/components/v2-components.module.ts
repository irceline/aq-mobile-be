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
import { UserNotificationSettingsComponent } from './user-notification-settings/user-notification-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocationSortableComponent } from './location-sortable/location-sortable.component';
import { BackgroundComponent } from './background/background.component';
import { InformationItemComponent } from './information-item/information-item.component';
import { HorizontalCardComponent } from './horizontal-card/horizontal-card.component';
import { HorizontalCardsSliderComponent } from './horizontal-cards-slider/horizontal-cards-slider.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { MenuScreenComponent } from './menu-screen/menu-screen.component';
import { InfoButtonComponent } from './info-button/info-button.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ValueDisplayComponent } from './value-display/value-display.component';
import { SuccessDisplayComponent } from './success-display/success-display.component';
import { InformationItemDetailsComponent } from './information-item-details/information-item-details.component';
import { MapComponent } from './map-component/map.component';

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
    LocationSortableComponent,
    BackgroundComponent,
    InformationItemComponent,
    HorizontalCardComponent,
    HorizontalCardsSliderComponent,
    BarChartComponent,
    MenuScreenComponent,
    InfoButtonComponent,
    FeedbackComponent,
    ValueDisplayComponent,
    SuccessDisplayComponent,
    InformationItemDetailsComponent,
    MapComponent,
];

@NgModule({
    imports: [
        AutoCompleteModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    entryComponents: COMPONENTS,
})
export class V2ComponentsModule {}
