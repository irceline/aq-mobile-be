import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import L from 'leaflet';

import { FeedbackCode } from '../../services/feedback/feedback.service';
import { FeedbackLocationEditComponent } from '../feedback-location-edit/feedback-location-edit.component';
import { FeedbackStatsComponent } from '../feedback-stats/feedback-stats.component';
import { UserLocation } from './../../Interfaces';
import { BelAQIService } from '../../services/bel-aqi.service';

export interface UserCreatedFeedback {
    codes: FeedbackCode[];
    latitude: number;
    longitude: number;
    situation?: string;
    otherCause?: string;
    date_start: string;
    date_end: string;
}

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss', './feedback.component.hc.scss'],
})
export class FeedbackComponent implements OnInit {

    @Input() location?: UserLocation;

    @Input()
    set belAqi(index: number) {
        this.backgroundColor = this.belAqiService.getLightColorForIndex(index);
    }
    @Output() feedbackOpened = new EventEmitter();
    @Output() feedbackGiven = new EventEmitter<UserCreatedFeedback>();
    private feedback!: UserCreatedFeedback;
    public backgroundColor;

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
        private translateSrvc: TranslateService,
        private belAqiService: BelAQIService,
    ) { }

    ngOnInit() {
        this.belAqiService.$activeIndex.subscribe((newIndex) => this.belAqi = newIndex?.indexScore);
     }

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
        this.feedback = {
            // @ts-ignore
            latitude: this.location.latitude,
            // @ts-ignore
            longitude: this.location.longitude,
            codes: []
        }
    }

    openFeedbackStats() {
        this.modalController.create({
            component: FeedbackStatsComponent,
            componentProps: {
                // @ts-ignore
                location: new L.LatLng(this.location.latitude, this.location.longitude)
            }
        }).then(modal => modal.present());
    }

    adjustLocation() {
        this.modalController.create({
            component: FeedbackLocationEditComponent,
            componentProps: {
                location: {
                    // @ts-ignore
                    longitude: this.location.longitude,
                    // @ts-ignore
                    latitude: this.location.latitude
                }
            }
        }).then(modal => {
            modal.present();
            modal.onDidDismiss().then(dismissed => {
                if (dismissed && dismissed.data && dismissed.data.latitude && dismissed.data.longitude) {
                    this.feedback.latitude = dismissed.data.latitude;
                    this.feedback.longitude = dismissed.data.longitude
                }
            })
        });
    }

    giveFeedback() {
        if (this.like) {
            this.feedback.codes = [FeedbackCode.INLINE];
        } else {
            const fbs = this.form.filter(e => e.isChecked).map(e => e.code);
            if (fbs.length > 0) {
                this.feedback.codes = fbs
            } else {
                this.feedback.codes = [FeedbackCode.NOT_INLINE_WITHOUT_INFO]
            }
        }
        this.feedbackGiven.emit(this.feedback);
    }
}
