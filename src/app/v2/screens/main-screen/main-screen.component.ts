import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataPointForDay, UserLocation } from '../../Interfaces';
import { UserSettingsService } from '../../services/user-settings.service';
import {
    BelAqiIndexResult,
    BelAQIService,
} from '../../services/bel-aqi.service';
import moment from 'moment';
import { DetailDataService } from '../../services/detail-data.service';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.scss'],
})
export class MainScreenComponent implements OnInit {
    // location data
    locations: UserLocation[] = [];
    currentLocation: UserLocation;

    // belAqi data
    private belAqiScores: BelAqiIndexResult[] = [];
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
        this.belAqiScores = this.belAqiService.getIndexScores(
            this.locations,
            5,
            5
        );

        // activate first location by default
        this.updateCurrentLocation(this.locations[0]);

        userSettingsService.$userLocations.subscribe((locations) => {
            this.locations = locations;
        });
    }

    private updateCurrentLocation(location: UserLocation) {
        this.currentLocation = location;

        this.belAqiForCurrentLocation = this.belAqiScores.filter(
            (iR) => iR.location.id === location.id
        );
        this.currentActiveIndex = this.belAqiForCurrentLocation.find(
            (iR) => Math.abs(iR.date.diff(moment(), 'days')) === 0
        );

        this.belAqiService.activeIndex = this.currentActiveIndex;

        this.updateDetailData();
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
            handleHeight: 190,
            gap: 150,
            thresholdFromBottom: 300,
            thresholdFromTop: 200,
            bounceBack: true,
        };
        this.contentHeight =
            this.platform.height() - this.drawerOptions.handleHeight - 63;
        console.log(this.contentHeight);
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
