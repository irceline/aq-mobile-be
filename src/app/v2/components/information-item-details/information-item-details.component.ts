import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-information-item-details',
    templateUrl: './information-item-details.component.html',
    styleUrls: ['./information-item-details.component.scss'],
})
export class InformationItemDetailsComponent implements OnInit {
    @Output() backClicked = new EventEmitter();

    @Input() detailPoint = null;

    constructor() {}

    ngOnInit() {}

    goBack() {
        this.backClicked.emit();
    }
}
