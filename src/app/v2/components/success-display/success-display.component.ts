import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FeedbackStats } from './../../services/feedback/feedback.service';
import { FeedbackStatsComponent } from './../feedback-stats/feedback-stats.component';

@Component({
  selector: 'app-success-display',
  templateUrl: './success-display.component.html',
  styleUrls: ['./success-display.component.scss'],
})
export class SuccessDisplayComponent implements OnInit {

  @Input() feedbackStats: FeedbackStats;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  async openStats() {
    this.modalController.create({
      component: FeedbackStatsComponent,
      componentProps: {
        feedbackStats: this.feedbackStats
      }
    }).then(modal => modal.present());
  }

}
