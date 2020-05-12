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

@Component({
    selector: 'app-circle-chart',
    templateUrl: './circle-chart.component.html',
    styleUrls: ['./circle-chart.component.scss'],
    animations: [
        trigger('itemAnim', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate(350),
            ]),
            transition(':leave', [
                group([
                    animate(
                        '0.2s ease',
                        style({
                            transform: 'translate(150px,25px)',
                        })
                    ),
                    animate(
                        '0.5s 0.2s ease',
                        style({
                            opacity: 0,
                        })
                    ),
                ]),
            ]),
        ]),
    ],
})
export class CircleChartComponent implements OnInit, OnChanges {
    // belaqi score index
    @Input() belAqi = 0;
    // big circle text
    @Input() title: string;
    // small circle text
    @Input() text: string;

    circumference = 1000;
    dashoffset = 0;
    circleOffset = 910;
    defaultOffset = 910;
    defaultRange = 92;
    textState = false;

    constructor() {}

    ngOnInit() {
        this._initialize(this.belAqi);
        this.textState = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.textState = true;
        this._initialize(changes.belAqi.currentValue);
        this._changeTitle(changes.belAqi.currentValue);
    }

    private _initialize(value: number) {
        const m = value * this.defaultRange;
        this.circleOffset = this.defaultOffset - m;
        this.dashoffset = value * this.defaultRange;
    }

    private _changeTitle(value: number) {
        console.log(value);
        switch (value) {
            case 1:
                this.title = 'Goed';
                this.textState = false;
                break;
            case 2:
                this.title = 'Test2';
                this.textState = false;
                break;
            case 3:
                this.title = 'Test3';
                this.textState = false;
                break;
            case 4:
                this.title = 'Test4';
                this.textState = false;
                break;
            case 5:
                this.title = 'Test5';
                this.textState = false;
                break;
            case 6:
                this.title = 'Test6';
                this.textState = false;
                break;
            default:
                break;
        }
    }

    animationDone(event) {
        console.log(event);
        // this.textState = false;
    }
}
