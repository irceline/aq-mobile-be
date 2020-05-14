import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-information-item',
    templateUrl: './information-item.component.html',
    styleUrls: ['./information-item.component.scss'],
})
export class InformationItemComponent implements OnInit {
    @Input() unit: string;
    @Input() unitName: string;
    @Input() color: string;
    @Input() evaluation: string;
    @Input() values: string;
    @Input() isButton = false;

    constructor() {}

    ngOnInit() {}
}
