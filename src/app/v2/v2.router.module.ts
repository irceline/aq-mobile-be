import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuScreenComponent } from './components/menu-screen/menu-screen.component';
import { AppInfoScreenComponent } from './screens/app-info-screen/app-info-screen.component';
import { LayoutScreenComponent } from './screens/layout-screen/layout-screen.component';
import { LongtermInfoScreenComponent } from './screens/longterm-info-screen/longterm-info-screen.component';
import { MainScreenComponent } from './screens/main-screen/main-screen.component';
import { OnboardingScreenComponent } from './screens/onboarding-screen/onboarding-screen.component';
import { OnboardingScreenGuard } from './screens/onboarding-screen/onboarding-screen.guard';
import { RatingScreenComponent } from './screens/rating-screen/rating-screen.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingScreenComponent,
    canActivate: [OnboardingScreenGuard]
  },
  {
    path: 'main',
    component: LayoutScreenComponent,
    children: [
      {
        path: '',
        component: MainScreenComponent,
      },
      {
        path: 'longterm-info',
        component: LongtermInfoScreenComponent,
      },
      {
        path: 'app-info',
        component: AppInfoScreenComponent,
      },
      {
        path: 'rating',
        component: RatingScreenComponent,
      },
      {
        path: 'menu',
        component: MenuScreenComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class V2RouterModule { }
