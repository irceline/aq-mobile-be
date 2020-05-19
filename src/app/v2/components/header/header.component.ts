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

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

    @HostBinding('style.background-color')
    public backgroundColor;

    @Input()
    set belAqi(index: number) {
        this.backgroundColor = this.getBackgroundForIndex(index);
    }

    menuVisible = false;

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService
    ) {
        belAQIService.$activeIndex.subscribe((newIndex) => {
            this.belAqi = newIndex.indexScore;
        });
    }

    ngOnInit() {}

    getBackgroundForIndex(index: number) {
        this.belAQIService.getLightColorForIndex(index);
    }

    toggleMenu() {
        this.menuVisible = !this.menuVisible;
    }

    closeMenu() {
        this.menuVisible = false;
    }

    openRating() {
        this.navCtrl.navigateForward(['main/rating'], { animated: false });
        this.menuVisible = false;
    }
}
