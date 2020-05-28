import {Component, Input, OnInit} from '@angular/core';
import {BelAqiIndexResult} from '../../services/bel-aqi.service';
import {indexLabel, lightIndexColor} from '../../common/constants';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-time-line-item',
  templateUrl: './time-line-item.component.html',
  styleUrls: ['./time-line-item.component.scss'],
})
export class TimeLineItemComponent implements OnInit {

  @Input() data: BelAqiIndexResult;

  constructor( private translate: TranslateService ) { }

  ngOnInit() {}

  getColor() {
    return lightIndexColor[this.data.indexScore] || null;
  }

  getDay() {
    // todo: better formatting
    return this.data.date.fromNow();
  }

  getLabel() {
    return this.translate.instant(indexLabel[this.data.indexScore]) || null;
  }

}
