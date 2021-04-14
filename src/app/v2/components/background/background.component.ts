import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { backgroundImages } from '../../common/constants';
import { BelAQIService } from '../../services/bel-aqi.service';

@Component({
    selector: 'app-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss', './background.component.hc.scss'],
})
export class BackgroundComponent implements OnDestroy {
    // @HostBinding('style.background-image')
    public backgroundImage;

    private indexSubscription: Subscription;

    constructor(
        private _sanitizer: DomSanitizer,
        private belAQIService: BelAQIService
    ) {
        this.indexSubscription = this.belAQIService.$activeIndex.subscribe((entry) => {
            if (entry) {
                this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl(`${backgroundImages[entry.indexScore]}`);
            } else {
                this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/bg.svg`);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.indexSubscription) {
            this.indexSubscription.unsubscribe();
        }
    }

}
