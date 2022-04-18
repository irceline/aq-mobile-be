import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

import { UserLocation } from '../../Interfaces';

@Component({
    selector: 'app-location-swipe',
    templateUrl: './location-swipe.component.html',
    styleUrls: ['./location-swipe.component.scss', './location-swipe.component.hc.scss'],
})
export class LocationSwipeComponent implements OnInit {
    private eventsSubscription: Subscription;
    
    @ViewChild(IonSlides, { static: true }) slides: IonSlides;
    @Output() locationChange = new EventEmitter<UserLocation>();
    @Input() locations: UserLocation[] = [];
    @Input() slideEvent: Observable<number>;

    private _activeIndex: number;
    
    @Input() set activeIndex(value: number) {
        this._activeIndex = value;
    }
    
    get activeIndex(): number {
        return this._activeIndex;
    }

    sliderOptions = {
        spaceBetween: 20,
        centeredSlides: true,
        slidesPerView: 2,
    };

    constructor() { }

    ngOnDestroy() {
        if (this.eventsSubscription) {
            this.eventsSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        if (!isNaN(this.activeIndex)) {
            this.slides.slideTo(this.activeIndex);
            this.slides.update();
        }

        if (this.slideEvent) {
            this.eventsSubscription = this.slideEvent.subscribe((index) => {
                this.activeIndex = index
                this.slides.slideTo(index);
                this.slides.update();
            });
        }
    }

    // Emit location change
    async slideChange() {
        const index = await this.slides.getActiveIndex();
        const location = this.locations[index];
        this.locationChange.next(location);
    }
}
