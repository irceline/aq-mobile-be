import {Component, Input, OnInit} from '@angular/core';
import {BelAqiIndexResult, BelAQIService} from '../../services/bel-aqi.service';

@Component({
  selector: 'app-time-line-item',
  templateUrl: './time-line-item.component.html',
  styleUrls: ['./time-line-item.component.scss'],
})
export class TimeLineItemComponent implements OnInit {

  @Input() data: BelAqiIndexResult;

  constructor( private belAqi: BelAQIService ) { }

  ngOnInit() {}

  getColor() {
    return this.belAqi.getLightColorForIndex( this.data.indexScore );
  }

  getDay() {
    // todo: better formatting
    return this.data.date.fromNow();
  }

  getLabel() {
    return this.belAqi.getLabelForIndex( this.data.indexScore );
  }

}
