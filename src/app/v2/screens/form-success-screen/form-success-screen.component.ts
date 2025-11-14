import { Component, Input, OnInit } from '@angular/core';
import {
  BelAqiIndexResult,
  BelAQIService,
} from '../../services/bel-aqi.service';
import { UserCreatedFeedback } from '../../components/feedback/feedback.component';
import {
  FeedbackService,
  FeedbackStats,
} from '../../services/feedback/feedback.service';
import { forkJoin } from 'rxjs';
import L from 'leaflet';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-form-success-screen',
  templateUrl: './form-success-screen.component.html',
  styleUrls: [
    './form-success-screen.component.scss',
    './form-success-screen.component.hc.scss',
  ],
})
export class FormSuccessScreenComponent implements OnInit {
  currentActiveIndex!: BelAqiIndexResult;
  feedbackStats!: FeedbackStats;
  feedbackLocation!: L.LatLng;

  public backgroundColor;

  @Input()
  set belAqi(index: number) {
    this.backgroundColor = this.belAqiService.getLightColorForIndex(index);
  }

  constructor(
    private feedbackSrvc: FeedbackService,
    private belAqiService: BelAQIService,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.belAqiService.$activeIndex.subscribe(
      (newIndex) => (this.belAqi = newIndex?.indexScore)
    );
  }

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

  goToReport() {
    this.navCtrl.navigateForward('/main/rating');
  }

  goToHome() {
    this.navCtrl.navigateForward('/main');
  }
}
