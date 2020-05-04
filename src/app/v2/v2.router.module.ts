import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IntroScreenComponent} from './screens/intro-screen/intro-screen.component';

const routes: Routes = [
    {
        path: '',
        component: IntroScreenComponent
    },
    // todo: other paths
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class V2RouterModule { }
