import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes,
    group,
} from '@angular/animations';
import { BelAQIService } from '../../services/bel-aqi.service';

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

    title: string;
    circumference = 1000;
    dashoffset = 0;
    circleOffset = 910;
    defaultOffset = 910;
    defaultRange = 92;

    constructor(private belaqiService: BelAQIService) {
        belaqiService.$activeIndex.subscribe( ( newIndex ) => {
            this.belAqi = newIndex.indexScore;
            this._initialize( this.belAqi );
        });
    }

    ngOnInit() {
        this._initialize(this.belAqi);
    }

    private _initialize(belaqi: number) {

        const inverted = 11 - belaqi;

        const range = inverted * this.defaultRange;
        this.circleOffset = this.defaultOffset - range;
        this.dashoffset = inverted * this.defaultRange;

        this._changeTitle(belaqi);
    }

    private _changeTitle(value: number) {
        this.title = this.belaqiService.getLabelForIndex(value);
        this.text = 'Gemiddelde score op jouw locatie is ' + this.title;
    }
}
