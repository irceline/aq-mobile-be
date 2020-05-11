import { Component, OnInit } from '@angular/core';
import { TimeLineItemInput } from '../../components/time-line-item/time-line-item.component';
import { BelAirColor } from '../../Interfaces';

@Component({
    selector: 'app-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.scss'],
})
export class MainScreenComponent implements OnInit {
    locationItems: TimeLineItemInput[] = [
        {
            color: BelAirColor.Blue,
            day: 'gisteren',
            status: 'Goed',
            selected: false,
        },
        {
            color: BelAirColor.Green,
            day: 'vandaag',
            status: 'Slecht',
            selected: true,
        },
        {
            color: BelAirColor.Red,
            day: 'morgen',
            status: 'Heel Goed',
            selected: false,
        },
    ];

    locations = ['New York', 'Los Angeles', 'San Francisco', 'Washington'];
    drawerOptions: any;

    protected belAqi = 3;

    constructor() {}

    ngOnInit() {
        this.drawerOptions = {
            handleHeight: 197,
            gap: 150,
            thresholdFromBottom: 300,
            thresholdFromTop: 200,
            bounceBack: true,
        };
    }

    onLocationChange(location: string) {
        console.log(location);
    }
}
