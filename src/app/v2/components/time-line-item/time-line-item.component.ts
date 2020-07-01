import { Component, Input, OnInit } from '@angular/core';

import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';

@Component({
  selector: 'app-time-line-item',
  templateUrl: './time-line-item.component.html',
  styleUrls: ['./time-line-item.component.scss'],
})
export class TimeLineItemComponent implements OnInit {

  @Input() data: BelAqiIndexResult;

  constructor(
    private belaqiSrvc: BelAQIService
  ) { }

  ngOnInit() { }

  getColor() {
    return this.belaqiSrvc.getLightColorForIndex(this.data.indexScore);
  }

  getDay() {
    // todo: better formatting
    return this.data.date.fromNow();
  }

  getLabel() {
    return this.belaqiSrvc.getLabelForIndex(this.data.indexScore);
  }

}
