import {
    Component,
    OnInit,
    ViewChild,
    HostBinding,
    Input,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { IonReorderGroup, NavController } from '@ionic/angular';

import { BelAQIService } from '../../services/bel-aqi.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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
        this.backgroundColor = this.getBackgroundForIndex(index);
    }

    menuVisible = false;
    onRatingScreen = false;

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService,
        private router: Router
    ) {
        belAQIService.$activeIndex.subscribe((newIndex) => {
            console.log(newIndex);
            this.belAqi = newIndex.indexScore;
        });

        router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((newRoute: NavigationEnd) => {
                this.onRatingScreen = newRoute.url === '/main/rating';
                console.log(this.onRatingScreen);
            });
    }

    ngOnInit() {}

    getBackgroundForIndex(index: number) {
        return this.belAQIService.getLightColorForIndex(index);
    }

    toggleMenu() {
        this.menuVisible = !this.menuVisible;
    }

    closeMenu() {
        this.menuVisible = false;
    }

    clickRating() {
        if (this.onRatingScreen) {
            this.navCtrl.navigateForward(['main']);
        } else {
            this.navCtrl.navigateForward(['main/rating']);
        }
        this.menuVisible = false;
    }
}
