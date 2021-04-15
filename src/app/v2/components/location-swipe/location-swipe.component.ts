import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { UserLocation } from '../../Interfaces';

@Component({
    selector: 'app-location-swipe',
    templateUrl: './location-swipe.component.html',
    styleUrls: ['./location-swipe.component.scss', './location-swipe.component.hc.scss'],
})
export class LocationSwipeComponent implements OnInit {
    @ViewChild(IonSlides, { static: true }) slides: IonSlides;
    @Output() locationChange = new EventEmitter<UserLocation>();
    @Input() locations: UserLocation[] = [];
    @Input() activeIndex: number;

    sliderOptions = {
        spaceBetween: 20,
        centeredSlides: true,
        slidesPerView: 2,
    };

    constructor() { }

    ngOnInit() {
        if (!isNaN(this.activeIndex)) {
            this.slides.slideTo(this.activeIndex);
            this.slides.update();
        }
    }

    // Emit location change
    async slideChange() {
        const index = await this.slides.getActiveIndex();
        const location = this.locations[index];
        this.locationChange.next(location);
    }
}
