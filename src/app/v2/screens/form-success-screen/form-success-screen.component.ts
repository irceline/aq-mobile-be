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

  goToReport() {
    this.navCtrl.navigateForward('/main/rating');
  }

  goToHome() {
    this.navCtrl.navigateForward('/main');
  }
}
