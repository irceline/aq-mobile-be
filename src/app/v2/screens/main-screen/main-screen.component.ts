import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import moment from 'moment';

import { DataPointForDay, UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { DetailDataService } from '../../services/detail-data.service';
import { UserSettingsService } from '../../services/user-settings.service';

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

    protected detailData: DataPointForDay[] = [];

    drawerOptions: any;

    protected belAqi = 10;

    detailPoint = null;
    contentHeight = 0;

    constructor(
        private userSettingsService: UserSettingsService,
        private belAqiService: BelAQIService,
        private detailDataService: DetailDataService,
        private platform: Platform
    ) {
        this.locations = userSettingsService.getUserSavedLocations();

        // activate first location by default
        this.updateCurrentLocation(this.locations[0]);

        userSettingsService.$userLocations.subscribe((locations) => {
            this.locations = locations;
        });
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
        this.detailDataLoadig = true;

        try {
            this.detailData = await this.detailDataService.getMeasurementsFor(
                this.currentActiveIndex.location,
                this.currentActiveIndex.date
            );
        } catch (e) {
            console.log(
                'failed to get detailed data for ',
                this.currentActiveIndex.location,
                this.currentActiveIndex.date
            );
        }

        this.detailDataLoadig = false;
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

        this.updateDetailData();
    }
}
