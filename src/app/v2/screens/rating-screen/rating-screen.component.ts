import { Component, OnInit } from '@angular/core';
import { UserLocation } from 'src/app/services/user-location-list/user-location-list.service';
import { UserSettingsService } from '../../services/user-settings.service';
import {
    BelAqiIndexResult,
    BelAQIService,
} from '../../services/bel-aqi.service';

@Component({
    selector: 'app-rating-screen',
    templateUrl: './rating-screen.component.html',
    styleUrls: ['./rating-screen.component.scss'],
})
export class RatingScreenComponent implements OnInit {
    locations: UserLocation[] = [];
    currentLocation: UserLocation;

    private belAqiScores: BelAqiIndexResult[] = [];
    currentActiveIndex: BelAqiIndexResult;

    isFeedbackOpened = false;
    isFeedbackGiven = false;

    constructor(
        private userSettingsService: UserSettingsService,
        private belAqiService: BelAQIService
    ) {
        this.locations = userSettingsService.getUserSavedLocations();

        // feedback is only for today
        this.belAqiScores = this.belAqiService.getIndexScores(
            this.locations,
            0,
            0
        );

        // activate first location by default
        this.updateCurrentLocation(this.locations[0]);

        userSettingsService.$userLocations.subscribe((locations) => {
            this.locations = locations;
        });
    }

    ngOnInit() {}

    private updateCurrentLocation(location: UserLocation) {
        this.currentLocation = location;

        this.currentActiveIndex = this.belAqiScores.find(
            (iR) => iR.location.id === location.id
        );

        this.belAqiService.activeIndex = this.currentActiveIndex;
    }

    onLocationChange(location: UserLocation) {
        this.updateCurrentLocation(location);
    }

    feedbackOpened() {
        this.isFeedbackOpened = true;
    }

    feedbackGiven(event) {
        this.isFeedbackGiven = true;
    }
}
