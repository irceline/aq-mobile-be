import { Component, OnInit } from '@angular/core';
import { UserLocation } from '../../Interfaces';
import { UserSettingsService } from '../../services/user-settings.service';
import {
    BelAqiIndexResult,
    BelAQIService,
} from '../../services/bel-aqi.service';
import moment from 'moment';

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

    // todo: create service that fetches this data based on day and location
    // information data
    informationData = [
        {
            unit: 'O3',
            unitName: 'Ozon',
            color: '#ff4a2e',
            evaluation: 'Heel Slecht',
            values:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
        },
        {
            unit: 'O3',
            unitName: 'Ozon',
            color: '#2df16b',
            evaluation: 'Goed',
            values:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
        },
        {
            unit: 'O3',
            unitName: 'Ozon',
            color: '#2df16b',
            evaluation: 'Goed',
            values:
                '106 µg/m3 berekend op jouw locatie, gemiddeld is dit 78 µg/m3.',
        },
    ];

    drawerOptions: any;

    protected belAqi = 10;

    constructor(
        private userSettingsService: UserSettingsService,
        private belAqiService: BelAQIService
    ) {
        this.locations = userSettingsService.getUserSavedLocations();
        this.belAqiScores = this.belAqiService.getIndexScores(
            this.locations,
            5,
            5
        );

        // activate first location by default
        this.updateCurrentLocation(this.locations[0]);

        userSettingsService.$userLocations.subscribe( locations => {
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
    }

    ngOnInit() {
        this.drawerOptions = {
            handleHeight: 197,
            gap: 150,
            thresholdFromBottom: 300,
            thresholdFromTop: 200,
            bounceBack: true,
        };
    }

    onLocationChange(location: UserLocation) {
        this.belAqi = Math.floor(Math.random() * 10) + 1;
        this.updateCurrentLocation(location);
    }

    onDayChange(index: BelAqiIndexResult) {
        this.currentActiveIndex = index;
        this.belAqiService.activeIndex = index;
    }
}
