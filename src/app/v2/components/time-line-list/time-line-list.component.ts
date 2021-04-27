import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonSlides, Platform } from '@ionic/angular';

import { ValueDate } from '../../common/enums';
import { BelAqiIndexResult } from '../../services/bel-aqi.service';

@Component({
    selector: 'app-time-line-list',
    templateUrl: './time-line-list.component.html',
    styleUrls: ['./time-line-list.component.scss', './time-line-list.component.hc.scss'],
})
export class TimeLineListComponent implements OnChanges {
    @ViewChild(IonSlides, { static: true }) slides: IonSlides;
    @Input() items: BelAqiIndexResult[];
    @Output() dayChange = new EventEmitter<BelAqiIndexResult>();

    timelineOptions: any = {
        slidesPerView: 3.5,
        spaceBetween: 5,
        centeredSlides: true
    };

    constructor(
        private platform: Platform
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.platform.is('ipad') || this.platform.is('tablet')) {
            this.timelineOptions.slidesPerView = 5;
        }
        if (changes.items && this.items && this.items.length > 0) {
            const idx = this.items.findIndex(e => e.valueDate === ValueDate.CURRENT);
            this.dayChange.next(this.items[idx]);
            this.slides.slideTo(idx);
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
