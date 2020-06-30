import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import moment from 'moment';

import { BelAqiIndexResult } from '../../services/bel-aqi.service';

@Component({
    selector: 'app-time-line-list',
    templateUrl: './time-line-list.component.html',
    styleUrls: ['./time-line-list.component.scss'],
})
export class TimeLineListComponent implements OnChanges {
    @ViewChild(IonSlides, { static: true }) slides: IonSlides;
    @Input() items: BelAqiIndexResult[];
    @Output() dayChange = new EventEmitter<BelAqiIndexResult>();

    timelineOptions: any = {
        slidesPerView: 3,
        spaceBetween: 5,
        centeredSlides: true
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items && this.items && this.items.length > 0) {
            let nearestItem = null;
            let dist = Infinity;
            const now = moment();
            this.items.forEach((e, i) => {
                const diff = Math.abs(now.diff(e.date));
                if (dist > diff) {
                    dist = diff;
                    nearestItem = i;
                }
            });
            this.slides.slideTo(nearestItem);
            this.slides.update();
        }
    }

    // Emit index result change
    async slideChange() {
        const index = await this.slides.getActiveIndex();
        const newIndexResult = this.items[index];
        this.dayChange.next(newIndexResult);
    }
}
