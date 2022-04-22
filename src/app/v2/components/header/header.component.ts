import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonReorderGroup, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BelAQIService } from '../../services/bel-aqi.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss', './header.component.hc.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

    @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

    private indexSubscription: Subscription;

    public locationsAvailable: boolean;

    // menuVisible = false;
    onRatingScreen = false;
    onMenuScreen = false;

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService,
        private router: Router
    ) {
        router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((newRoute: NavigationEnd) => {
                this.onRatingScreen = newRoute.url === '/main/rating';
                this.onMenuScreen = newRoute.url.includes('/main/menu');
            });
    }

    ngOnInit() {
        this.indexSubscription = this.belAQIService.$activeIndex
            .subscribe((newIndex) => this.locationsAvailable = !!newIndex);
    }

    ngOnDestroy(): void {
        if (this.indexSubscription) { this.indexSubscription.unsubscribe(); }
    }

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
