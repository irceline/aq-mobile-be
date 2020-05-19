import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-value-display',
    templateUrl: './value-display.component.html',
    styleUrls: ['./value-display.component.scss'],
})
export class ValueDisplayComponent implements OnInit {
    @Input() color = '#ccc';
    @Input() score = 0;
    @Input() value = 'No value';

    constructor() {}

    ngOnInit() {}
}
