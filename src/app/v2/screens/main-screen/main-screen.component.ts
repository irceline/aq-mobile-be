import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { ValueDate } from '../../common/enums';
import { MainPhenomenon } from '../../common/phenomenon';
import { DataPoint, Substance, UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { AnnualMeanValueService } from '../../services/value-provider/annual-mean-value.service';
import { ModelledValueService } from '../../services/value-provider/modelled-value.service';
import { lightIndexColor } from './../../common/constants';

interface IndexValueResult extends BelAqiIndexResult {
    value: number;
}

@Component({
    selector: 'app-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.scss'],
    animations: [],
})
export class MainScreenComponent implements OnInit {
    // location data
    locations: UserLocation[] = [];

    // belAqi data
    belAqiForCurrentLocation: BelAqiIndexResult[] = [];
    currentActiveIndex: BelAqiIndexResult;

    valueTimeline: BelAqiIndexResult[] = [];
    detailsValueColor: string;
    detailsValue: number;

    chooseTypeClicked: boolean;

    detailedPhenomenona: Substance[] = [
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

    detailData: DataPoint[] = [];

    belaqiDetailData: DataPoint;

    drawerOptions: any;

    protected belAqi = 10;

    detailPoint: DataPoint = null;
    contentHeight = 0;

    detailsValueDate: ValueDate;

    constructor(
        public userSettingsService: UserSettingsService,
        private translateService: TranslateService,
        private belAqiService: BelAQIService,
        private modelledValueService: ModelledValueService,
        private annulMeanValueService: AnnualMeanValueService,
        private platform: Platform,
    ) {
        this.locations = this.userSettingsService.getUserSavedLocations();

        this.updateCurrentLocation();

        this.userSettingsService.$userLocations.subscribe((locations) => this.locations = locations);
    }

    public showHideButtons(): void {
        this.chooseTypeClicked = !this.chooseTypeClicked;
    }

    private updateCurrentLocation(loadFinishedCb?: () => any) {
        return this.belAqiService.getIndexScoresAsObservable(this.userSettingsService.selectedUserLocation).subscribe(
            res => {
                this.belAqiForCurrentLocation = res.filter(e => e !== null);
                this.updateDetailData(loadFinishedCb);
            }, error => {
                console.error('Error occured while fetching the bel aqi indicies');
                if (loadFinishedCb) { loadFinishedCb(); }
            });
    }

    private async updateDetailData(loadFinishedCb?: () => any) {
        this.detailData = [];
        this.detailDataLoadig = true;

        const currentBelAqi = this.belAqiForCurrentLocation.find(e => e.valueDate === ValueDate.CURRENT);
        this.belaqiDetailData = {
            color: this.belAqiService.getLightColorForIndex(currentBelAqi.indexScore),
            evaluation: this.belAqiService.getLabelForIndex(currentBelAqi.indexScore),
            location: this.userSettingsService.selectedUserLocation,
            substance: {
                name: this.translateService.instant('v2.screens.app-info.belaqi-title'),
                abbreviation: 'BelAQI',
                phenomenon: MainPhenomenon.BELAQI
            }
        };

        this.detailedPhenomenona.forEach(dph => {
            forkJoin([
                this.modelledValueService.getCurrentValue(this.userSettingsService.selectedUserLocation, dph.phenomenon),
                this.annulMeanValueService.getLastValue(this.userSettingsService.selectedUserLocation, dph.phenomenon)
            ]).subscribe(
                res => {
                    if (res[0] != null) {
                        this.detailData.push({
                            location: this.userSettingsService.selectedUserLocation,
                            currentValue: Math.round(res[0].value),
                            averageValue: res[1] ? Math.round(res[1].value) : null,
                            substance: dph,
                            evaluation: this.belAqiService.getLabelForIndex(res[0].index),
                            color: this.belAqiService.getLightColorForIndex(res[0].index)
                        });
                    }
                    this.detailDataLoadig = false;
                    if (loadFinishedCb) { loadFinishedCb(); }
                },
                error => {
                    console.error(error);
                    if (loadFinishedCb) { loadFinishedCb(); }
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

    ionViewWillEnter() {
        if (this.currentActiveIndex) {
            this.belAqiService.activeIndex = this.currentActiveIndex;
        }
    }

    doRefresh(event) {
        this.updateCurrentLocation(() => event.target.complete());
    }

    onLocationChange(location: UserLocation) {
        this.userSettingsService.selectedUserLocation = location;
        this.updateCurrentLocation();
    }

    onDayChange(index: BelAqiIndexResult) {
        this.currentActiveIndex = index;
        this.belAqiService.activeIndex = index;
    }

    openDetails(selectedDataPoint: DataPoint) {
        this.detailPoint = selectedDataPoint;
        this.modelledValueService.getValueTimeline(
            this.userSettingsService.selectedUserLocation,
            selectedDataPoint.substance.phenomenon
        ).subscribe(res => {
            this.valueTimeline = res
                .filter(e => e !== null)
                .map(e => ({
                    date: e.date,
                    indexScore: e.index,
                    value: e.value,
                    valueDate: e.valueDate,
                    location: this.userSettingsService.selectedUserLocation,
                }));
        });
    }

    openBelaqiDetails() {
        this.detailPoint = this.belaqiDetailData;
        this.valueTimeline = this.belAqiForCurrentLocation;
    }

    onDetailsDayChange(index: IndexValueResult) {
        this.detailsValueDate = index.valueDate;
        this.detailsValueColor = lightIndexColor[index.indexScore];
        this.detailsValue = Math.round(index.value);
    }
}
