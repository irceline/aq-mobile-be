import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { BelAQIService } from '../../services/bel-aqi.service';
import { FeedbackService, FeedbackStats } from '../../services/feedback/feedback.service';

@Component({
  selector: 'app-feedback-stats',
  templateUrl: './feedback-stats.component.html',
  styleUrls: ['./feedback-stats.component.scss', './feedback-stats.component.hc.scss'],
})
export class FeedbackStatsComponent implements OnInit {

  @Input() public feedbackStats: FeedbackStats;

  @Input() public location: L.LatLng;

  public backgroundColor: string;

  constructor(
    private modalCtrl: ModalController,
    private belAQIService: BelAQIService,
    private feedbackSrvc: FeedbackService
  ) { }

  ngOnInit() {
    this.belAQIService.$activeIndex.subscribe(idx =>  {
      if (idx) this.backgroundColor = this.belAQIService.getLightColorForIndex(idx.indexScore)
    });

    if (!this.feedbackStats) {
      this.feedbackSrvc.getFeedbackStats().subscribe(
        stats => this.setStats(stats),
        error => this.notifyError(error)
      );
    }
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  private notifyError(error: any): void {
    console.error(error);
  }

  private setStats(stats: FeedbackStats): void {
    this.feedbackStats = stats;
  }

}
