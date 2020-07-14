import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ValueDate } from '../../common/enums';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';

@Component({
  selector: 'app-time-line-item',
  templateUrl: './time-line-item.component.html',
  styleUrls: ['./time-line-item.component.scss'],
})
export class TimeLineItemComponent implements OnInit {

  @Input() data: BelAqiIndexResult;

  constructor(
    private belaqiSrvc: BelAQIService,
    private translate: TranslateService
  ) { }

  ngOnInit() { }

  getColor() {
    return this.belaqiSrvc.getLightColorForIndex(this.data.indexScore);
  }

  getDay() {
    switch (this.data.valueDate) {
      case ValueDate.BEFORE_THREE_DAYS:
        return this.translate.instant('belaqi.date.before-three-days');
      case ValueDate.BEFORE_TWO_DAYS:
        return this.translate.instant('belaqi.date.before-two-days');
      case ValueDate.YESTERDAY:
        return this.translate.instant('belaqi.date.yesterday');
      case ValueDate.CURRENT:
        return this.translate.instant('belaqi.date.current');
      case ValueDate.TODAY:
        return this.translate.instant('belaqi.date.today');
      case ValueDate.TOMORROW:
        return this.translate.instant('belaqi.date.tomorrow');
      case ValueDate.IN_TWO_DAYS:
        return this.translate.instant('belaqi.date.in-two-days');
      case ValueDate.IN_THREE_DAYS:
        return this.translate.instant('belaqi.date.in-three-days');
    }
  }

  getLabel() {
    return this.belaqiSrvc.getLabelForIndex(this.data.indexScore);
  }

}
