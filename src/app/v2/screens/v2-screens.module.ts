import { NgModule } from '@angular/core';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OnboardingScreenComponent } from './onboarding-screen/onboarding-screen.component';
import { V2ComponentsModule } from '../components/v2-components.module';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppInfoScreenComponent } from './app-info-screen/app-info-screen.component';
import { LongtermInfoScreenComponent } from './longterm-info-screen/longterm-info-screen.component';
import { LayoutScreenComponent } from './layout-screen/layout-screen.component';
import { RatingScreenComponent } from './rating-screen/rating-screen.component';

const SCREENS = [
    OnboardingScreenComponent,
    MainScreenComponent,
    AppInfoScreenComponent,
    LongtermInfoScreenComponent,
    LayoutScreenComponent,
    RatingScreenComponent,
];

@NgModule({
    imports: [
        AutoCompleteModule,
        CommonModule,
        FormsModule,
        IonicModule,
        V2ComponentsModule,
        TranslateModule,
    ],
    declarations: SCREENS,
    exports: SCREENS,
    entryComponents: SCREENS,
})
export class V2ScreensModule {}
