import { Component, Input, OnInit } from '@angular/core';
import { BelAqiIndexResult } from '../../services/bel-aqi.service';

@Component({
    selector: 'app-time-line-list',
    templateUrl: './time-line-list.component.html',
    styleUrls: ['./time-line-list.component.scss'],
})
export class TimeLineListComponent implements OnInit {
    @Input() items: BelAqiIndexResult[];

    timelineOptions = {
        slidesPerView: 3,
        spaceBetween: 5,
        centeredSlides: true,
    };

    // todo:: add events when changing timeline, report back to mainscreen

    constructor() {}

    ngOnInit() {}
}
