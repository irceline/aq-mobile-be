import { Component, OnInit, Input } from '@angular/core';
import {DetailDataPoint} from '../../services/detail-data.service';

@Component({
    selector: 'app-information-item',
    templateUrl: './information-item.component.html',
    styleUrls: ['./information-item.component.scss'],
})
export class InformationItemComponent implements OnInit {

    @Input() detailedDataPoint: DetailDataPoint;

    @Input() isButton = false;

    constructor() {}

    ngOnInit() {}
}
