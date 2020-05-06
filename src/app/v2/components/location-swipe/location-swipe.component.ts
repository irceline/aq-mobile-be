import {
    Component,
    OnInit,
    ViewChild,
    EventEmitter,
    Output,
    Input,
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
    @Input() locations = [];

    sliderOptions = {
        spaceBetween: 20,
        centeredSlides: true,
        slidesPerView: 2,
    };

    constructor() {}

    ngOnInit() {}

    // Emit location change
    async slideChange() {
        const index = await this.slides.getActiveIndex();
        const location = this.locations[index];
        this.locationChange.next(location);
    }
}
