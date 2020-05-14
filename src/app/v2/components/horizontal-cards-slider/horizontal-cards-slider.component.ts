import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-horizontal-cards-slider',
    templateUrl: './horizontal-cards-slider.component.html',
    styleUrls: ['./horizontal-cards-slider.component.scss'],
})
export class HorizontalCardsSliderComponent implements OnInit {
    @Input() data = [];

    slideOptions = {
        spaceBetween: 10,
    };

    constructor() {}

    ngOnInit() {}
}
