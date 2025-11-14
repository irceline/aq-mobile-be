import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HelgolandMapViewModule } from '@helgoland/map';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
// import { AutoCompleteModule } from 'ionic4-auto-complete';

import { BackgroundComponent } from './background/background.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { CircleChartComponent } from './circle-chart/circle-chart.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { FeedbackLocationEditComponent } from './feedback-location-edit/feedback-location-edit.component';
import { FeedbackStatsMapComponent } from './feedback-stats/feedback-stats-map/feedback-stats-map.component';
import { FeedbackStatsComponent } from './feedback-stats/feedback-stats.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HeaderComponent } from './header/header.component';
import { HorizontalCardComponent } from './horizontal-card/horizontal-card.component';
import { HorizontalCardsSliderComponent } from './horizontal-cards-slider/horizontal-cards-slider.component';
import { InfoButtonComponent } from './info-button/info-button.component';
import { InformationItemDetailsComponent } from './information-item-details/information-item-details.component';
import { InformationItemComponent } from './information-item/information-item.component';
import { LanguageDropdownComponent } from './language-dropdown/language-dropdown.component';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { LocationInputComponent } from './location-input/location-input.component';
import { LocationSortableComponent } from './location-sortable/location-sortable.component';
import { LocationSwipeComponent } from './location-swipe/location-swipe.component';
import { MapComponent } from './map-component/map.component';
import { MenuScreenComponent } from './menu-screen/menu-screen.component';
import { NotificationPopoverComponent } from './notification-popover/notification-popover.component';
import { OnboardingSliderComponent } from './onboarding-slider/onboarding-slider.component';
import { ParameterInformationComponent } from './parameter-information/parameter-information.component';
import { PullTabComponent } from './pull-tab/pull-tab.component';
import { SuccessDisplayComponent } from './success-display/success-display.component';
import { TimeLineItemComponent } from './time-line-item/time-line-item.component';
import { TimeLineListComponent } from './time-line-list/time-line-list.component';
import { ThemeButtonComponent } from './theme-button/theme-button.component';
import { UserNotificationSettingsComponent } from './user-notification-settings/user-notification-settings.component';
import { ValueDisplayComponent } from './value-display/value-display.component';

import { register } from 'swiper/element/bundle';
import { SwiperDirective } from '../directives/swipper.directive';
import { FeedbackCalendarComponent } from './feedback-calendar/feedback-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarTemplateComponent } from './calendar-template/calendar-template';
import { MapsBottomSheetComponent } from './maps-bottom-sheet/maps-bottom-sheet.component';

register();

const COMPONENTS = [
  SwiperDirective,
  ParameterInformationComponent,
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
  NotificationPopoverComponent,
  LocationEditComponent,
  BarChartComponent,
  MenuScreenComponent,
  InfoButtonComponent,
  FeedbackComponent,
  FeedbackStatsComponent,
  FeedbackStatsMapComponent,
  FeedbackLocationEditComponent,
  ValueDisplayComponent,
  SuccessDisplayComponent,
  InformationItemDetailsComponent,
  MapComponent,
  ErrorModalComponent,
  ThemeButtonComponent,
  FeedbackCalendarComponent,
  CalendarTemplateComponent,
  MapsBottomSheetComponent
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    // AutoCompleteModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    HelgolandMapViewModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  // entryComponents: COMPONENTS,
})
export class V2ComponentsModule { }
