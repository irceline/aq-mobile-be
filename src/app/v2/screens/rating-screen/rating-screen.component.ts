import { Component, OnInit } from '@angular/core';

import { UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { BelaqiIndexService } from '../../services/value-provider/belaqi-index.service';

@Component({
    selector: 'app-rating-screen',
    templateUrl: './rating-screen.component.html',
    styleUrls: ['./rating-screen.component.scss'],
})
export class RatingScreenComponent implements OnInit {
    locations: UserLocation[] = [];
    currentLocation: UserLocation;

    currentActiveIndex: BelAqiIndexResult;

    isFeedbackOpened = false;
    isFeedbackGiven = false;

    constructor(
        private userSettingsService: UserSettingsService,
        private belAqiService: BelAQIService,
        private belaqiIndexSrvc: BelaqiIndexService
    ) { }

    ngOnInit() {
        this.locations = this.userSettingsService.getUserSavedLocations();

        // activate first location by default
        this.updateCurrentLocation(this.locations[0]);

        this.userSettingsService.$userLocations.subscribe((locations) => {
            this.locations = locations;
        });
    }

    private updateCurrentLocation(location: UserLocation) {
        this.belaqiIndexSrvc.getTodaysIndex(location).subscribe(
            res => {
                this.currentLocation = location;
                this.currentActiveIndex = res;
                this.belAqiService.activeIndex = this.currentActiveIndex;
            }
        );
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
