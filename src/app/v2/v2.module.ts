import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { V2RouterModule } from './v2.router.module';
import { V2ComponentsModule } from './components/v2-components.module';
import { V2ScreensModule } from './screens/v2-screens.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    V2RouterModule,
    V2ComponentsModule,
    V2ScreensModule,
  ],
})
export class V2Module { }
