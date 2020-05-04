import {Component, Input, OnInit} from '@angular/core';
import { TimeLineItemInput } from '../time-line-item/time-line-item.component';

@Component({
  selector: 'app-time-line-list',
  templateUrl: './time-line-list.component.html',
  styleUrls: ['./time-line-list.component.scss'],
})
export class TimeLineListComponent implements OnInit {

  @Input() items: TimeLineItemInput[];

  constructor() { }

  ngOnInit() {}

}
