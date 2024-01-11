import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import { forkJoin } from 'rxjs';

import { UserCreatedFeedback } from '../../components/feedback/feedback.component';
import { UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { BelaqiIndexService } from '../../services/value-provider/belaqi-index.service';
import { FeedbackStats } from './../../services/feedback/feedback.service';

@Component({
  selector: 'app-rating-screen',
  templateUrl: './rating-screen.component.html',
  styleUrls: ['./rating-screen.component.scss', './rating-screen.component.hc.scss'],
})
export class RatingScreenComponent implements OnInit {
  locations: UserLocation[] = [];
  currentLocation!: UserLocation;
  currentActiveIndex!: BelAqiIndexResult;

  isFeedbackOpened = false;
  feedbackStats!: FeedbackStats;
  activeIndex!: number;
  feedbackLocation!: L.LatLng;

  constructor(
    private userSettingsService: UserSettingsService,
    private belAqiService: BelAQIService,
    private belaqiIndexSrvc: BelaqiIndexService,
    private feedbackSrvc: FeedbackService
  ) { }

  ngOnInit() {
    this.locations = this.userSettingsService.getUserSavedLocations();

    // activate first location by default
    this.activeIndex = this.locations.findIndex(e => this.userSettingsService.selectedUserLocation.id === e.id);
    this.updateCurrentLocation(this.locations[this.activeIndex]);

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

  // @ts-ignore
  onLocationChange(location: UserLocation) {
    this.updateCurrentLocation(location);
  }

  feedbackOpened() {
    this.isFeedbackOpened = true;
  }

  /**
   * Send feedback
   *
   * @param feedback
   */
  feedbackGiven(feedback: UserCreatedFeedback) {
    this.randomizeFeedbackLocation(feedback);
    const feedbackSubmits = feedback.codes.map(fbcode =>
      this.feedbackSrvc.sendFeedback({
        lat: feedback.latitude,
        lng: feedback.longitude,
        feedback_code: fbcode
      })
    );

    try {
      forkJoin(feedbackSubmits).subscribe(stats => {
        if (stats.length >= 1) {
          this.feedbackStats = stats[0];
          console.log(this.feedbackStats);
        }
        this.feedbackLocation = new L.LatLng(feedback.latitude, feedback.longitude);
      });
    } catch (error) {
      console.error(error);
    }
  }

  private randomizeFeedbackLocation(feedback: UserCreatedFeedback): UserCreatedFeedback {
    const randomize = function (n: number, dec: number) {
      const shift = Math.pow(10, dec - 1);
      n = Math.round(n * shift) / shift;
      n = Math.random() / shift + n;
      return n;
    }
    feedback.latitude = randomize(feedback.latitude, 4);
    feedback.longitude = randomize(feedback.longitude, 4);
    return feedback;
  }

}
