import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { BelaqiUserLocationSliderComponent } from './belaqi-user-location-slider/belaqi-user-location-slider.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule
  ],
  declarations: [
    BelaqiUserLocationSliderComponent
  ],
  exports: [
    BelaqiUserLocationSliderComponent
  ],
  entryComponents: [

  ]
})
export class ComponentsModule { }
