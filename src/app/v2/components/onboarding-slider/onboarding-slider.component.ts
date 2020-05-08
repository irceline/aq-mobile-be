import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {UserLocation} from '../../Interfaces';

@Component({
    selector: 'app-onboarding-slider',
    templateUrl: './onboarding-slider.component.html',
    styleUrls: ['./onboarding-slider.component.scss'],
})
export class OnboardingSliderComponent implements OnInit {

    @Output() slideShowComplete = new EventEmitter();

    @ViewChild(IonSlides) slides: IonSlides;

    public btnText: string;


    constructor(private translate: TranslateService) {
        this.btnText = translate.instant('v2.components.onboarding-slider.btn-text');
    }

    ngOnInit() {}

    // Logic for next button
    async next() {
        const isEnd = await this.slides.isEnd();
        if (isEnd) {
            this.slideShowComplete.emit();
        } else {
            this.slides.slideNext();
        }
    }

    // Changing the text when reaches the end of slides
    async slideChanged() {
        const isEnd = await this.slides.isEnd();
        if (isEnd) {
            this.btnText = this.translate.instant('v2.components.onboarding-slider.start-app');
        } else {
            this.btnText = this.translate.instant('v2.components.onboarding-slider.btn-text');
        }
    }
}
