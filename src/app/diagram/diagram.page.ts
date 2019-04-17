import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DrawerState } from '../components/overlay-info-drawer/overlay-info-drawer';
import { HeaderContent } from '../components/slider-header/slider-header.component';

@Component({
  selector: 'diagram',
  templateUrl: './diagram.page.html',
  styleUrls: ['./diagram.page.scss'],
})
export class DiagramPage {

  public sliderHeader: HeaderContent;

  public dockedHeight = 92;
  public drawerState = DrawerState.Docked;

  constructor(
    public translateSrvc: TranslateService,
  ) { }

}
