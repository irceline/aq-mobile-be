import {Component, Input, OnInit} from '@angular/core';
import { BelAirColor } from '../../Interfaces';

export interface TimeLineItemInput {
  color: BelAirColor;
  status: string;
  day: string;
  selected: boolean;
}

@Component({
  selector: 'app-time-line-item',
  templateUrl: './time-line-item.component.html',
  styleUrls: ['./time-line-item.component.scss'],
})
export class TimeLineItemComponent implements OnInit {

  @Input() data: TimeLineItemInput;

  constructor() { }

  ngOnInit() {}

}
