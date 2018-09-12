import { NgModule } from '@angular/core';
import { HelgolandMapSelectorModule } from '@helgoland/map';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { MapPage } from './map';

@NgModule({
  declarations: [
    MapPage
  ],
  imports: [
    IonicPageModule.forChild(MapPage),
    ComponentsModule,
    TranslateModule,
    HelgolandMapSelectorModule
  ]
})
export class MapModule { }
