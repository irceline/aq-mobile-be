import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { IonReorderGroup, NavController } from '@ionic/angular';

import { BelAQIService } from '../../services/bel-aqi.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { lightIndexColor } from '../../common/constants';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

    public backgroundColor;

    @Input()
    set belAqi(index: number) {
        this.backgroundColor = lightIndexColor[index] || null;
    }

    // menuVisible = false;
    onRatingScreen = false;
    onMenuScreen = false;

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService,
        private router: Router
    ) {
        belAQIService.$activeIndex.subscribe((newIndex) => {
            this.belAqi = newIndex.indexScore;
        });

        router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((newRoute: NavigationEnd) => {
                this.onRatingScreen = newRoute.url === '/main/rating';
                this.onMenuScreen = newRoute.url === '/main/menu';
            });
    }

    ngOnInit() {}

    toggleMenu() {
        if (this.onMenuScreen) {
            this.navCtrl.navigateBack(['main']);
        } else {
            this.navCtrl.navigateForward(['main/menu']);
        }
    }

    // closeMenu() {
    //     this.menuVisible = false;
    // }

    clickRating() {
        if (this.onRatingScreen) {
            this.navCtrl.navigateBack(['main']);
        } else {
            this.navCtrl.navigateForward(['main/rating']);
        }
        // this.menuVisible = false;
    }
}
