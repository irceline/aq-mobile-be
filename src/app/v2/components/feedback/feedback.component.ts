import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    HostBinding,
} from '@angular/core';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
    @Output() feedbackOpened = new EventEmitter();
    @Output() feedbackGiven = new EventEmitter();

    like = false;
    dislike = false;

    // todo : check data structure , simpler values?
    form = [
        { val: 'Verbranding van hout', isChecked: false },
        { val: 'Uitlaatgassen van verkeer', isChecked: false },
        { val: 'Uitstoot door industrie of landbouw', isChecked: false },
    ];

    constructor() {}

    ngOnInit() {}

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

    giveFeedback() {
        this.feedbackGiven.emit({
            location: null,
            reason: '',
        });
    }
}
