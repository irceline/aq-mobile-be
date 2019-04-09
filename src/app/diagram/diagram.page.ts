import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HeaderContent } from '../components/slider-header/slider-header.component';

@Component({
  selector: 'diagram',
  templateUrl: './diagram.page.html',
  styleUrls: ['./diagram.page.scss'],
})
export class DiagramPage {

  public sliderHeader: HeaderContent;

  constructor(
    public translateSrvc: TranslateService,
  ) { }

}
