import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { LongTermDataPoint } from '../../Interfaces';
import { BelAQIService } from '../../services/bel-aqi.service';
import { LongTermDataService } from '../../services/long-term-data.service';

@Component({
    selector: 'app-longterm-info-screen',
    templateUrl: './longterm-info-screen.component.html',
    styleUrls: ['./longterm-info-screen.component.scss', './longterm-info-screen.component.hc.scss'],
})
export class LongtermInfoScreenComponent implements OnInit {

    longTermData: LongTermDataPoint[] = [];
    loading: boolean;

    constructor(
        private navCtrl: NavController,
        private longTermDataService: LongTermDataService,
        private belaqiSrvc: BelAQIService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.belaqiSrvc.$activeIndex.subscribe(res => {
            if (res) {
                this.longTermDataService
                    .getLongTermDataFor(res.location)
                    .then((longTermData) => {
                        // some transformations for charts
                        this.loading = false;
                        this.longTermData = longTermData.map((ltd) => ({
                            ...ltd,
                            lastYearValue: ltd.historicalValues
                                ? ltd.historicalValues[ltd.historicalValues.length - 1].value
                                : 0,
                            chartData: {
                                labels: ltd.historicalValues.map((hv) =>
                                    hv.year.toString(10)
                                ),
                                data: ltd.historicalValues.map((hv) => ({
                                    value: hv.value,
                                    background: hv.evaluationColor,
                                })),
                                max:
                                    Math.max(
                                        ...ltd.historicalValues.map((hv) => hv.value)
                                    ) + 10,
                            },
                        }));
                    })
                    .catch((e) => {
                        console.log(
                            'there was an error fetching the long term data for location',
                            location
                        );
                    });
            }
        });
    }

    goBack() {
        this.navCtrl.navigateBack(['/main']);
    }

    goToLongTerm() {
        this.navCtrl.navigateForward(['/main/long-term']);
    }
}
