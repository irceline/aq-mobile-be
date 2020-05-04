import {Component, OnInit} from '@angular/core';
import {TimeLineItemInput} from '../../components/time-line-item/time-line-item.component';
import {BelAirColor} from '../../Interfaces';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
})
export class MainScreenComponent implements OnInit {


  locationItems: TimeLineItemInput[] = [
    {
      color: BelAirColor.Blue,
      day: 'gisteren',
      status: 'Goed',
      selected: false
    },
    {
      color: BelAirColor.Green,
      day: 'vandaag',
      status: 'Slecht',
      selected: true
    },
    {
      color: BelAirColor.Red,
      day: 'morgen',
      status: 'Heel Goed',
      selected: false
    }
  ];

  constructor() { }

  ngOnInit() {}

}
