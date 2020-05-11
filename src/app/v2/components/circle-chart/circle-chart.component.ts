import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-circle-chart',
    templateUrl: './circle-chart.component.html',
    styleUrls: ['./circle-chart.component.scss'],
})
export class CircleChartComponent implements OnInit {
    // belaqi score index
    @Input() belaqi = 0;
    // big circle text
    @Input() title: string;
    // small circle text
    @Input() text: string;

    circumference = 1000;
    dashoffset = 0;
    circleOffset = 910;
    defaultRange = 92;

    constructor() {}

    ngOnInit() {
        this._initialize(this.belaqi);
    }

    private _initialize(value: number) {
        this.circleOffset = this.circleOffset - value * this.defaultRange;
        this.dashoffset = value * this.defaultRange;
    }
}
