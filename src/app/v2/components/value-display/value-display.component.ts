import { indexLabel } from './../../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

import { lightIndexColor } from '../../common/constants';

@Component({
    selector: 'app-value-display',
    templateUrl: './value-display.component.html',
    styleUrls: ['./value-display.component.scss'],
})
export class ValueDisplayComponent implements OnInit {

    @Input() index;
    @Input() score;
    @Input() value: string;

    constructor(
        private translateSrvc: TranslateService
    ) { }

    ngOnInit() { }

    public get color(): string {
        return lightIndexColor[this.index];
    }

    public get label(): string {
        if (isNaN(this.score)) {
            return this.translateSrvc.instant(indexLabel[this.index]);
        } else {
            return Math.round(this.score).toString();
        }
    }

}
