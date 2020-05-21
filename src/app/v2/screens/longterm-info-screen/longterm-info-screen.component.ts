import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {LongTermDataService} from '../../services/long-term-data.service';
import {LongTermDataPoint, UserLocation} from '../../Interfaces';

@Component({
    selector: 'app-longterm-info-screen',
    templateUrl: './longterm-info-screen.component.html',
    styleUrls: ['./longterm-info-screen.component.scss'],
})
export class LongtermInfoScreenComponent implements OnInit {
    informationData = [
        {
            unit: 'O3',
            unitName: 'Ozon',
            color: '#ff4a2e',
            evaluation: 'Heel Slecht',
            values:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
            chartData: {
                data: [
                    {
                        value: 20,
                        background: '#de3f28',
                    },
                    {
                        value: 60,
                        background: '#af234a',
                    },
                    {
                        value: 110,
                        background: '#27d25d',
                    },
                    {
                        value: 130,
                        background: '#24bd3c',
                    },
                    {
                        value: 150,
                        background: '#27d25d',
                    },
                ],
                labels: ['2015', '2016', '2017', '2018', '2020'],
                max: 150,
                euMax: 100,
                worldMax: 50,
            },
        },
        {
            unit: 'O3',
            unitName: 'Ozon',
            color: '#2df16b',
            evaluation: 'Goed',
            values:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
            chartData: {
                data: [
                    {
                        value: 50,
                        background: '#de3f28',
                    },
                    {
                        value: 20,
                        background: '#af234a',
                    },
                    {
                        value: 80,
                        background: '#27d25d',
                    },
                    {
                        value: 130,
                        background: '#24bd3c',
                    },
                    {
                        value: 150,
                        background: '#27d25d',
                    },
                ],
                labels: ['2015', '2016', '2017', '2018', '2020'],
                max: 150,
                euMax: 120,
                worldMax: 60,
            },
        },
        {
            unit: 'O3',
            unitName: 'Ozon',
            color: '#2df16b',
            evaluation: 'Goed',
            values:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
            chartData: {
                data: [
                    {
                        value: 0,
                        background: '#de3f28',
                    },
                    {
                        value: 20,
                        background: '#af234a',
                    },
                    {
                        value: 70,
                        background: '#27d25d',
                    },
                    {
                        value: 40,
                        background: '#24bd3c',
                    },
                    {
                        value: 120,
                        background: '#27d25d',
                    },
                ],
                labels: ['2015', '2016', '2017', '2018', '2020'],
                max: 150,
                euMax: 40,
                worldMax: 80,
            },
        },
    ];

    longTermData: LongTermDataPoint[] = [];

    constructor(private navCtrl: NavController, longTermDataService: LongTermDataService) {

        // todo -> get current selected user location
        // either from route params or from a session data service
        // ... implementation task
        // @ts-ignore
        const location: UserLocation = {};

        longTermDataService.getLongTermDataFor(location).then(longTermData => {

            // some transformations for charts
            this.longTermData = longTermData.map( ltd => ({
                ...ltd,
                chartData: {
                    labels: ltd.historicalValues.map( hv => hv.year.toString(10 )),
                    data: ltd.historicalValues.map( hv => ({
                        value: hv.value,
                        background: hv.evaluationColor
                    })),
                    max: Math.max( ...ltd.historicalValues.map( hv => hv.value ) ) + 10
                }
            }));

            console.log( this.longTermData );


        }).catch( e => {
            console.log( 'there was an error fetching the long term data for location', location );
        });

    }



    ngOnInit() {}

    goBack() {
        this.navCtrl.navigateBack(['/main'], { animated: false });
    }
}
