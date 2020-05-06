import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';

@Component({
    selector: 'app-onboarding-slider',
    templateUrl: './onboarding-slider.component.html',
    styleUrls: ['./onboarding-slider.component.scss'],
})
export class OnboardingSliderComponent implements OnInit {
    @ViewChild(IonSlides) slides: IonSlides;
    @Input() btnText: string;

    constructor(public navCtrl: NavController) {}

    ngOnInit() {}

    // Logic for next button
    async next() {
        const isEnd = await this.slides.isEnd();
        if (isEnd) {
            this.navCtrl.navigateForward('v2/main');
        } else {
            this.slides.slideNext();
        }
    }

    // Changing the text when reaches the end of slides
    async slideChanged() {
        const isEnd = await this.slides.isEnd();
        if (isEnd) {
            this.btnText = 'Start de app';
        } else {
            this.btnText = 'Ga verder';
        }
    }
}
