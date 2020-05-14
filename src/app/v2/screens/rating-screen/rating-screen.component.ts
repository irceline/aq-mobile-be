import { Component, OnInit } from '@angular/core';
import { UserLocation } from 'src/app/services/user-location-list/user-location-list.service';
import { UserSettingsService } from '../../services/user-settings.service';
import {
    BelAqiIndexResult,
    BelAQIService,
} from '../../services/bel-aqi.service';
import moment from 'moment';

@Component({
    selector: 'app-rating-screen',
    templateUrl: './rating-screen.component.html',
    styleUrls: ['./rating-screen.component.scss'],
})
export class RatingScreenComponent implements OnInit {
    locations: UserLocation[] = [];
    currentLocation: UserLocation;

    private belAqiScores: BelAqiIndexResult[] = [];
    belAqiForCurrentLocation: BelAqiIndexResult[] = [];
    currentActiveIndex: BelAqiIndexResult;

    protected belAqi = 10;

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
    }

    ngOnInit() {}

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

    onLocationChange(location: UserLocation) {
        console.log(location);
        this.belAqi = Math.floor(Math.random() * 10) + 1;
        this.updateCurrentLocation(location);
    }
}
