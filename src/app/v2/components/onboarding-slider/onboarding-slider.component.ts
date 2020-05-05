import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonSlides, IonSelect } from '@ionic/angular';
import {
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes,
} from '@angular/animations';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
    selector: 'app-onboarding-slider',
    templateUrl: './onboarding-slider.component.html',
    styleUrls: ['./onboarding-slider.component.scss'],
    animations: [
        trigger('bounce', [
            state(
                '*',
                style({
                    transform: 'translateX(0)',
                })
            ),
            transition(
                '* => rightSwipe',
                animate(
                    '700ms ease-out',
                    keyframes([
                        style({
                            transform: 'translateX(0)',
                            offset: 0,
                        }),
                        style({
                            transform: 'translateX(-65px)',
                            offset: 0.3,
                        }),
                        style({
                            transform: 'translateX(0)',
                            offset: 1.0,
                        }),
                    ])
                )
            ),
            transition(
                '* => leftSwipe',
                animate(
                    '700ms ease-out',
                    keyframes([
                        style({
                            transform: 'translateX(0)',
                            offset: 0,
                        }),
                        style({
                            transform: 'translateX(65px)',
                            offset: 0.3,
                        }),
                        style({
                            transform: 'translateX(0)',
                            offset: 1.0,
                        }),
                    ])
                )
            ),
        ]),
    ],
})
export class OnboardingSliderComponent implements OnInit {
    @ViewChild(IonSlides) slides: IonSlides;
    @ViewChild('select') select: ElementRef;

    btnText = 'Ga verder';
    state = 'x';
    language = 'e';

    constructor(
        public navCtrl: NavController,
        private geolocation: Geolocation
    ) {}

    ngOnInit() {
        setTimeout(() => {
            const ionSelects = document.querySelectorAll('ion-select');
            if (ionSelects.length) {
                ionSelects[0].shadowRoot.children[1].setAttribute(
                    'style',
                    'display: none !important'
                );
            }
        }, 500);
    }

    async next() {
        const isEnd = await this.slides.isEnd();
        if (isEnd) {
            this.navCtrl.navigateForward('v2/main');
        } else {
            this.slides.slideNext();
        }
    }

    async slideChanged() {
        const isEnd = await this.slides.isEnd();
        if (isEnd) {
            this.btnText = 'Start de app';
        }
    }

    async slideMoved() {
        const activeIndex = await this.slides.getActiveIndex();
        const previousIndex = (await this.slides.getPreviousIndex()) || 0;

        if (activeIndex >= previousIndex) {
            this.state = 'rightSwipe';
        } else {
            this.state = 'leftSwipe';
        }
    }

    animationDone() {
        this.state = 'x';
    }

    getCurrentLocation() {
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                console.log(resp);
                // resp.coords.latitude
                // resp.coords.longitude
            })
            .catch((error) => {
                console.log('Error getting location', error);
            });
    }
}
