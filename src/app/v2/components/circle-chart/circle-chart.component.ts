import {
    Component,
    OnInit,
    Input,
    OnChanges,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { BelAQIService } from '../../services/bel-aqi.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-circle-chart',
    templateUrl: './circle-chart.component.html',
    styleUrls: ['./circle-chart.component.scss'],
})
export class CircleChartComponent implements OnInit {
    // belaqi score index
    @Input() belAqi = 0;
    // small circle text

    @Input() text: string;

    height: number;
    title: string;
    circumference = 1000;
    dashoffset = 0;
    circleOffset = 910;
    defaultOffset = 910;
    defaultRange = 92;

    pulsingText = {
        pulsing: false,
    };

    constructor(
        private belaqiService: BelAQIService,
        private translate: TranslateService,
        public element: ElementRef
    ) {
        belaqiService.$activeIndex.subscribe((newIndex) => {
            this.belAqi = newIndex.indexScore;
            this._initialize(this.belAqi);
        });
    }

    ngOnInit() {
        this._initialize(this.belAqi);
    }

    getChartHeight() {
        return this.element.nativeElement.offsetHeight || 315;
    }

    private _initialize(belaqi: number) {
        const inverted = 11 - belaqi;

        const range = inverted * this.defaultRange;
        this.circleOffset = this.defaultOffset - range;
        this.dashoffset = inverted * this.defaultRange;

        this._changeTitle(belaqi);
    }

    private _changeTitle(value: number) {
        this.pulsingText.pulsing = true;
        this.title = this.belaqiService.getLabelForIndex(value);
        this.text = this.translate.instant(
            'v2.components.circle-chart.avg-score',
            { score: this.title }
        );
    }
}
