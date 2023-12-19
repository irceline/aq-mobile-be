import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DataPoint } from '../../Interfaces';

@Component({
    selector: 'app-information-item',
    templateUrl: './information-item.component.html',
    styleUrls: ['./information-item.component.scss','./information-item.component.hc.scss'],
})
export class InformationItemComponent implements OnInit {
    @Output() backClicked = new EventEmitter();

    // @ts-ignore
    @Input() detailedDataPoint: DataPoint;
    @Input() isButton = false;
    @Input() hasBackBtn = false;

    constructor(
      private translate: TranslateService
    ) { }

    ngOnInit() { }

    goBack() {
        this.backClicked.emit();
    }
}
