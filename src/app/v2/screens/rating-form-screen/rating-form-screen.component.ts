import { Component, Input, OnInit, ViewChild } from '@angular/core';
import L from 'leaflet';
import { forkJoin } from 'rxjs';
import { BackgroundComponent } from '../../components/background/background.component';

import { UserCreatedFeedback } from '../../components/feedback/feedback.component';
import { UserLocation } from '../../Interfaces';
import {
  BelAqiIndexResult,
  BelAQIService,
} from '../../services/bel-aqi.service';
import {
  FeedbackCode,
  FeedbackService,
} from '../../services/feedback/feedback.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { BelaqiIndexService } from '../../services/value-provider/belaqi-index.service';
import { FeedbackStats } from '../../services/feedback/feedback.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { FeedbackStatsComponent } from '../../components/feedback-stats/feedback-stats.component';
import { FeedbackStatsMapComponent } from '../../components/feedback-stats/feedback-stats-map/feedback-stats-map.component';
import { FeedbackLocationEditComponent } from '../../components/feedback-location-edit/feedback-location-edit.component';
import { FeedbackCalendarComponent } from '../../components/feedback-calendar/feedback-calendar.component';

@Component({
  selector: 'app-rating-form-screen',
  templateUrl: './rating-form-screen.component.html',
  styleUrls: [
    './rating-form-screen.component.scss',
    './rating-form-screen.component.hc.scss',
  ],
})
export class RatingFormScreenComponent implements OnInit {
  locations: UserLocation[] = [];
  currentLocation!: UserLocation;
  currentActiveIndex!: BelAqiIndexResult;

  isFeedbackOpened = false;
  feedbackStats!: FeedbackStats;
  activeIndex!: number;
  feedbackLocation!: L.LatLng;
  ionContentRef!: any;
  feedback!: UserCreatedFeedback;
  showMap: boolean = false;
  causes = [
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.fire'),
      iconInactive: '/assets/images/icons/woodburn.svg',
      iconActive: '/assets/images/icons/woodburn-blue.svg',
      selected: false,
      code: FeedbackCode.WOODBURN,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.exhaust'),
      iconInactive: '/assets/images/icons/traffic.svg',
      iconActive: '/assets/images/icons/traffic-blue.svg',
      selected: false,
      code: FeedbackCode.TRAFFIC,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.industry'),
      iconInactive: '/assets/images/icons/industry.svg',
      iconActive: '/assets/images/icons/industry-blue.svg',
      selected: false,
      code: FeedbackCode.INDUSTRY,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.agriculture'),
      iconInactive: '/assets/images/icons/agriculture.svg',
      iconActive: '/assets/images/icons/agriculture-blue.svg',
      selected: false,
      code: FeedbackCode.AGRICULTURE,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.other'),
      iconInactive: '/assets/images/icons/more.svg',
      iconActive: '/assets/images/icons/more-blue.svg',
      selected: false,
      code: FeedbackCode.NOT_INLINE_WITHOUT_INFO,
    },
  ];

  public backgroundColor;

  @Input()
  set belAqi(index: number) {
    this.backgroundColor = this.belAqiService.getLightColorForIndex(index);
  }

  @ViewChild('background') private background!: BackgroundComponent;

  constructor(
    private userSettingsService: UserSettingsService,
    private belAqiService: BelAQIService,
    private belaqiIndexSrvc: BelaqiIndexService,
    private feedbackSrvc: FeedbackService,
    private translateSrvc: TranslateService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.locations = this.userSettingsService.getUserSavedLocations();
    // activate first location by default
    this.activeIndex = this.locations.findIndex(
      (e) => this.userSettingsService.selectedUserLocation.id === e.id
    );
    this.updateCurrentLocation(this.locations[this.activeIndex]);

    this.userSettingsService.$userLocations.subscribe((locations) => {
      this.locations = locations;
    });
    this.belAqiService.$activeIndex.subscribe(
      (newIndex) => (this.belAqi = newIndex?.indexScore)
    );
  }

  private updateCurrentLocation(location: UserLocation) {
    this.belaqiIndexSrvc.getCurrentIndex(location).subscribe((res) => {
      this.currentLocation = location;
      this.currentActiveIndex = res;
      this.belAqiService.activeIndex = this.currentActiveIndex;
    });
  }

  // @ts-ignore
  onLocationChange(location: UserLocation) {
    this.updateCurrentLocation(location);
  }

  /**
   * Send feedback
   *
   * @param feedback
   */
  feedbackGiven(feedback: UserCreatedFeedback) {
    this.randomizeFeedbackLocation(feedback);
    const feedbackSubmits = feedback.codes.map((fbcode) =>
      this.feedbackSrvc.sendFeedback({
        lat: feedback.latitude,
        lng: feedback.longitude,
        feedback_code: fbcode,
      })
    );

    try {
      forkJoin(feedbackSubmits).subscribe((stats) => {
        if (stats.length >= 1) {
          this.feedbackStats = stats[0];
          console.log(this.feedbackStats);
        }
        this.feedbackLocation = new L.LatLng(
          feedback.latitude,
          feedback.longitude
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  private randomizeFeedbackLocation(
    feedback: UserCreatedFeedback
  ): UserCreatedFeedback {
    const randomize = function (n: number, dec: number) {
      const shift = Math.pow(10, dec - 1);
      n = Math.round(n * shift) / shift;
      n = Math.random() / shift + n;
      return n;
    };
    feedback.latitude = randomize(feedback.latitude, 4);
    feedback.longitude = randomize(feedback.longitude, 4);
    return feedback;
  }

  selectCause(index: number) {
    this.causes[index].selected = !this.causes[index].selected;
  }

  openMaps() {
    this.showMap = true;
    this.modalController
      .create({
        component: FeedbackLocationEditComponent,
        componentProps: {
          location: {
            // @ts-ignore
            longitude: this.currentActiveIndex?.location?.longitude,
            // @ts-ignore
            latitude: this.currentActiveIndex?.location?.latitude,
          },
        },
        cssClass: 'bottom-sheet-modal',
        breakpoints: [0, 1],
        initialBreakpoint: 1,
        handle: false,
        canDismiss: false,
      })
      .then((modal) => {
        modal.present();

        modal.onDidDismiss().then((dismissed) => {
          if (
            dismissed &&
            dismissed.data &&
            dismissed.data.latitude &&
            dismissed.data.longitude
          ) {
            this.feedback.latitude = dismissed.data.latitude;
            this.feedback.longitude = dismissed.data.longitude;
          }
          this.showMap = false;
        });
      });
  }

  openCalendar() {
    this.modalController
      .create({
        component: FeedbackCalendarComponent,
        cssClass: 'bottom-sheet-modal',
        breakpoints: [0, 1],
        initialBreakpoint: 1,
      })
      .then((modal) => {
        modal.present();

        modal.onDidDismiss().then((dismissed) => {
          if (
            dismissed &&
            dismissed.data &&
            dismissed.data.latitude &&
            dismissed.data.longitude
          ) {
            this.feedback.latitude = dismissed.data.latitude;
            this.feedback.longitude = dismissed.data.longitude;
          }
          this.showMap = false;
        });
      });
  }
}
