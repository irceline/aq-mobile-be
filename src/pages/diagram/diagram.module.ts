import { NgModule } from '@angular/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { DiagramPage } from './diagram';

@NgModule({
  declarations: [
    DiagramPage
  ],
  imports: [
    IonicPageModule.forChild(DiagramPage),
    ComponentsModule,
    TranslateModule,
    HelgolandD3Module
  ]
})
export class DiagramModule { }
