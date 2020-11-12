import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { FeedbackCode, FeedbackService } from '../../services/feedback/feedback.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { BelaqiIndexService } from '../../services/value-provider/belaqi-index.service';
import { FeedbackStats } from './../../services/feedback/feedback.service';

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
    feedbackStats: FeedbackStats;

    constructor(
        private userSettingsService: UserSettingsService,
        private belAqiService: BelAQIService,
        private belaqiIndexSrvc: BelaqiIndexService,
        private feedbackSrvc: FeedbackService
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
        this.belaqiIndexSrvc.getCurrentIndex(location).subscribe(
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

    feedbackGiven(feedbackCodes: FeedbackCode[]) {
        const feedbackSubmits = feedbackCodes.map(fbcode =>
            this.feedbackSrvc.sendFeedback({
                lat: this.currentLocation.latitude,
                lng: this.currentLocation.longitude,
                feedback_code: fbcode
            })
        );
        forkJoin(feedbackSubmits).subscribe(stats => {
            if (stats.length >= 1) {
                this.feedbackStats = stats[0];
                console.log(this.feedbackStats);
            }
            this.isFeedbackGiven = true;
        });
    }
}
