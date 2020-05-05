import {
    Component,
    OnInit,
    ViewChild,
    EventEmitter,
    Output,
} from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
    selector: 'app-location-swipe',
    templateUrl: './location-swipe.component.html',
    styleUrls: ['./location-swipe.component.scss'],
})
export class LocationSwipeComponent implements OnInit {
    @ViewChild(IonSlides) slides: IonSlides;
    @Output() locationChange = new EventEmitter();

    sliderOptions = {
        spaceBetween: 100,
        centeredSlides: true,
        slidesPerView: 3,
    };

    locations = ['Cepin', 'Osijek', 'Zagreb', 'Split', 'Rijeka'];

    constructor() {}

    ngOnInit() {}

    // Emit location change
    async slideChange() {
        const index = await this.slides.getActiveIndex();
        const location = this.locations[index];
        this.locationChange.next(location);
    }
}
