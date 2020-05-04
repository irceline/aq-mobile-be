import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OnboardingScreenComponent} from './screens/onboarding-screen/onboarding-screen.component';
import {MainScreenComponent} from './screens/main-screen/main-screen.component';

const routes: Routes = [
    {
        path: '',
        component: OnboardingScreenComponent
    },
    {
        path: 'main',
        component: MainScreenComponent
    }
    // todo: other paths
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class V2RouterModule { }
