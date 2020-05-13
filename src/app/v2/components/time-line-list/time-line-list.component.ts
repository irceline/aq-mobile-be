import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { BelAqiIndexResult } from '../../services/bel-aqi.service';
import {IonSlides} from '@ionic/angular';

@Component({
    selector: 'app-time-line-list',
    templateUrl: './time-line-list.component.html',
    styleUrls: ['./time-line-list.component.scss'],
})
export class TimeLineListComponent implements OnInit {
    @ViewChild(IonSlides) slides: IonSlides;
    @Input() items: BelAqiIndexResult[];
    @Output() dayChange = new EventEmitter<BelAqiIndexResult>();

    timelineOptions = {
        slidesPerView: 3,
        spaceBetween: 5,
        centeredSlides: true,
    };

    // todo:: add events when changing timeline, report back to mainscreen

    constructor() {}

    ngOnInit() {}

    // Emit index result change
    async slideChange() {
        const index = await this.slides.getActiveIndex();
        const newIndexResult = this.items[index];
        this.dayChange.next(newIndexResult);
    }
}
