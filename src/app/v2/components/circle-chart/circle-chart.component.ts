import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-circle-chart',
    templateUrl: './circle-chart.component.html',
    styleUrls: ['./circle-chart.component.scss'],
})
export class CircleChartComponent implements OnInit {
    @Input() percentage = 0;

    circumference = 1000;
    dashoffset = 0;
    defaultRange = 90;

    constructor() {}

    ngOnInit() {
        this.progress(this.percentage);
    }

    private progress(value: number) {
        this.dashoffset = (value / 10) * this.defaultRange;
    }
}
