import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { forkJoin } from 'rxjs';

import { DataPoint, UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { ModelledValueService } from '../../services/modelled-value.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { MainPhenomenon } from './../../../model/phenomenon';
import { AnnualMeanValueService } from './../../services/annual-mean-value.service';

@Component({
    selector: 'app-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.scss'],
    animations: [],
})
export class MainScreenComponent implements OnInit {
    // location data
    locations: UserLocation[] = [];
    currentLocation: UserLocation;

    // belAqi data
    belAqiForCurrentLocation: BelAqiIndexResult[] = [];
    currentActiveIndex: BelAqiIndexResult;

    detailedPhenomenona = [
        {
            name: this.translateService.instant('v2.screens.app-info.ozon'),
            abbreviation: 'O&#8323;',
            unit: 'µg/m3',
            phenomenon: MainPhenomenon.O3
        },
        {
            name: this.translateService.instant('v2.screens.app-info.nitrogen-dioxide'),
            abbreviation: 'NO&#8322;',
            unit: 'µg/m3',
            phenomenon: MainPhenomenon.NO2
        },
        {
            name: this.translateService.instant('v2.screens.app-info.fine-dust'),
            abbreviation: 'PM 10',
            unit: 'µg/m3',
            phenomenon: MainPhenomenon.PM10
        },
        {
            name: this.translateService.instant('v2.screens.app-info.very-fine-dust'),
            abbreviation: 'PM 2,5',
            unit: 'µg/m3',
            phenomenon: MainPhenomenon.PM25
        },
    ];

    // horizontal slider data
    slidesData = [
        {
            icon: '/assets/images/icons/sport-kleur.svg',
            title: 'Sporttip',
            text:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
        },
        {
            icon: '/assets/images/icons/sport-kleur.svg',
            title: 'Sporttip',
            text:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
        },
        {
            icon: '/assets/images/icons/sport-kleur.svg',
            title: 'Sporttip',
            text:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
        },
    ];

    // keep track of loading status
    detailDataLoadig = false;

    protected detailData: DataPoint[] = [];

    drawerOptions: any;

    protected belAqi = 10;

    detailPoint = null;
    contentHeight = 0;

    constructor(
        private userSettingsService: UserSettingsService,
        private translateService: TranslateService,
        private belAqiService: BelAQIService,
        private modelledValueService: ModelledValueService,
        private annulMeanValueService: AnnualMeanValueService,
        private platform: Platform
    ) {
        this.locations = this.userSettingsService.getUserSavedLocations();

        // activate first location by default
        this.updateCurrentLocation(this.locations[0]);

        this.userSettingsService.$userLocations.subscribe((locations) => this.locations = locations);
    }

    private updateCurrentLocation(location: UserLocation) {
        this.currentLocation = location;

        this.belAqiService.getIndexScoresAsObservable(location).subscribe(res => {
            this.belAqiForCurrentLocation = res;
            // keep track of the current day;
            const dateReference = this.currentActiveIndex ? this.currentActiveIndex.date : moment();
            console.log(dateReference);

            this.currentActiveIndex = this.belAqiForCurrentLocation.find(
                (iR) => Math.abs(iR.date.diff(dateReference, 'hours')) === 0
            );

            this.belAqiService.activeIndex = this.currentActiveIndex;

            this.updateDetailData();
        });
    }

    private async updateDetailData() {
        this.detailData = [];
        this.detailDataLoadig = true;

        this.detailedPhenomenona.forEach(dph => {
            forkJoin([
                this.modelledValueService.getValue(this.currentLocation, dph.phenomenon),
                this.annulMeanValueService.getLastValue(this.currentLocation, dph.phenomenon)
            ]).subscribe(
                res => {
                    this.detailData.push({
                        location: this.currentLocation,
                        currentValue: Math.round(res[0].value),
                        averageValue: res[1] ? Math.round(res[1].value) : null,
                        substance: dph,
                        evaluation: this.belAqiService.getLabelForIndex(res[0].index),
                        color: this.belAqiService.getLightColorForIndex(res[0].index)
                    });
                    this.detailDataLoadig = false;
                },
                error => {
                    console.error(error);
                });
        });
    }

    ngOnInit() {
        this.drawerOptions = {
            handleHeight: 150,
            gap: 120,
            thresholdFromBottom: 300,
            thresholdFromTop: 50,
            bounceBack: true,
        };
        this.contentHeight =
            this.platform.height() - this.drawerOptions.handleHeight - 56;
    }

    onLocationChange(location: UserLocation) {
        this.updateCurrentLocation(location);
    }

    onDayChange(index: BelAqiIndexResult) {
        this.currentActiveIndex = index;
        this.belAqiService.activeIndex = index;

        // this.updateDetailData();
    }
}
