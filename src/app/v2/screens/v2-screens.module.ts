// modules
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { V2ComponentsModule } from '../components/v2-components.module';

// screens
import { AppInfoScreenComponent } from './app-info-screen/app-info-screen.component';
import { LayoutScreenComponent } from './layout-screen/layout-screen.component';
import { LongtermInfoScreenComponent } from './longterm-info-screen/longterm-info-screen.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { MenuScreenComponent } from './menu-screen/menu-screen.component';
import { OnboardingScreenComponent } from './onboarding-screen/onboarding-screen.component';
import { RatingScreenComponent } from './rating-screen/rating-screen.component';

const SCREENS = [
    AppInfoScreenComponent,
    LayoutScreenComponent,
    LongtermInfoScreenComponent,
    MainScreenComponent,
    MenuScreenComponent,
    OnboardingScreenComponent,
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
