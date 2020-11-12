import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FeedbackCode } from '../../services/feedback/feedback.service';
import { FeedbackStatsComponent } from '../feedback-stats/feedback-stats.component';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
    @Output() feedbackOpened = new EventEmitter();
    @Output() feedbackGiven = new EventEmitter<FeedbackCode[]>();

    like = false;
    dislike = false;

    form = [
        { val: this.translateSrvc.instant('feedback-reason.woodburn'), isChecked: false, code: FeedbackCode.WOODBURN },
        { val: this.translateSrvc.instant('feedback-reason.traffic'), isChecked: false, code: FeedbackCode.TRAFFIC },
        { val: this.translateSrvc.instant('feedback-reason.agriculture'), isChecked: false, code: FeedbackCode.AGRICULTURE },
        { val: this.translateSrvc.instant('feedback-reason.industry'), isChecked: false, code: FeedbackCode.INDUSTRY }
    ];

    constructor(
        private modalController: ModalController,
        private translateSrvc: TranslateService
    ) { }

    ngOnInit() { }

    openFeedback(type: string) {
        if (type === 'like') {
            this.like = true;
            this.dislike = false;
            this.feedbackOpened.emit(true);
        } else {
            this.like = false;
            this.dislike = true;
            this.feedbackOpened.emit(true);
        }
    }

    openFeedbackStats() {
        this.modalController.create({ component: FeedbackStatsComponent }).then(modal => modal.present());
    }

    giveFeedback() {
        if (this.like) {
            this.feedbackGiven.emit([FeedbackCode.INLINE]);
        } else {
            const fbs = this.form.filter(e => e.isChecked).map(e => e.code);
            if (fbs.length > 0) {
                this.feedbackGiven.emit(fbs);
            } else {
                this.feedbackGiven.emit([FeedbackCode.NOT_INLINE_WITHOUT_INFO]);
            }
        }
    }
}
