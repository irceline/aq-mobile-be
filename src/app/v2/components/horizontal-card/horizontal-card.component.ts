import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-horizontal-card',
    templateUrl: './horizontal-card.component.html',
    styleUrls: ['./horizontal-card.component.scss'],
})
export class HorizontalCardComponent implements OnInit {
    @Input() icon: string;
    @Input() title: string;
    @Input() text: string;

    constructor() {}

    ngOnInit() {}
}
