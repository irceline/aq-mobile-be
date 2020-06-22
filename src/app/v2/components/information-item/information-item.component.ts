import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DataPoint } from '../../Interfaces';

@Component({
    selector: 'app-information-item',
    templateUrl: './information-item.component.html',
    styleUrls: ['./information-item.component.scss'],
})
export class InformationItemComponent implements OnInit {
    @Output() backClicked = new EventEmitter();

    @Input() detailedDataPoint: DataPoint;
    @Input() isButton = false;
    @Input() hasBackBtn = false;

    constructor() { }

    ngOnInit() { }

    goBack() {
        this.backClicked.emit();
    }
}
