import { Component, OnInit } from '@angular/core';
import {
    BelAqiIndexResult,
    BelAQIService,
} from '../../services/bel-aqi.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserLocation } from 'src/app/services/user-location-list/user-location-list.service';
import moment from 'moment';

@Component({
    selector: 'app-layout-screen',
    templateUrl: './layout-screen.component.html',
    styleUrls: ['./layout-screen.component.scss'],
})
export class LayoutScreenComponent implements OnInit {
    protected belAqi = 10;

    // location data
    locations: UserLocation[] = [];
    currentLocation: UserLocation;

    // belAqi data
    private belAqiScores: BelAqiIndexResult[] = [];
    belAqiForCurrentLocation: BelAqiIndexResult[] = [];
    currentActiveIndex: BelAqiIndexResult;

    constructor(
        private userLocationsService: UserSettingsService,
        private belAqiService: BelAQIService
    ) {
        this.locations = userLocationsService.getUserSavedLocations();
        this.belAqiScores = this.belAqiService.getIndexScores(
            this.locations,
            5,
            5
        );

        // activate first location by default
        this.updateCurrentLocation(this.locations[0]);
    }

    private updateCurrentLocation(location: UserLocation) {
        this.currentLocation = location;
        this.belAqiForCurrentLocation = this.belAqiScores.filter(
            (iR) => iR.location.id === location.id
        );
        this.currentActiveIndex = this.belAqiForCurrentLocation.find(
            (iR) => Math.abs(iR.date.diff(moment(), 'days')) === 0
        );

        console.log(this.currentActiveIndex);
    }

    ngOnInit() {}
}
