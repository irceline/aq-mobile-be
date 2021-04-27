import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { lightIndexColor } from '../../common/constants';
import { indexLabel } from './../../common/constants';

@Component({
    selector: 'app-value-display',
    templateUrl: './value-display.component.html',
    styleUrls: ['./value-display.component.scss', './value-display.component.hc.scss'],
})
export class ValueDisplayComponent implements OnChanges {

    @Input() color;
    @Input() index;
    @Input() score;
    @Input() value: string;

    public label: string;

    public labelColor: string;

    constructor(
        private translateSrvc: TranslateService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.score || changes.index) {
            if (isNaN(this.score)) {
                this.label = this.translateSrvc.instant(indexLabel[this.index]);
            } else {
                this.label = Math.round(this.score).toString();
            }
        }

        if (changes.color || changes.index) {
            if (this.color) {
                this.labelColor = this.color;
            }
            this.labelColor = lightIndexColor[this.index];
        }
    }

}
