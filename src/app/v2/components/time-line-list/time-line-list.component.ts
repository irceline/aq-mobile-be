import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { BelAqiIndexResult } from '../../services/bel-aqi.service';
import {IonSlides} from '@ionic/angular';

@Component({
    selector: 'app-time-line-list',
    templateUrl: './time-line-list.component.html',
    styleUrls: ['./time-line-list.component.scss'],
})
export class TimeLineListComponent implements OnInit, OnChanges {
    @ViewChild(IonSlides, { static: true }) slides: IonSlides;
    @Input() items: BelAqiIndexResult[];
    @Output() dayChange = new EventEmitter<BelAqiIndexResult>();

    timelineOptions: any = {
        slidesPerView: 3,
        spaceBetween: 5,
        centeredSlides: true
    };

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        this.timelineOptions.initialSlide = changes.items.currentValue.length / 2;
        this.slides.update();
    }

    ngOnInit() {}

    // Emit index result change
    async slideChange() {
        const index = await this.slides.getActiveIndex();
        const newIndexResult = this.items[index];
        this.dayChange.next(newIndexResult);
    }
}
