import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { backgroundImages, lightIndexColor, contrastModeColor } from '../../common/constants';
import { BelAQIService } from '../../services/bel-aqi.service';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';

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
        private belAQIService: BelAQIService,
        private statusBar: StatusBar,
        private themeService: ThemeHandlerService
    ) {
        this.indexSubscription = this.belAQIService.$activeIndex.subscribe(async (entry) => {
            const mode = await this.themeService.getActiveTheme()
            if (entry) {
                this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl(`${backgroundImages[entry.indexScore]}`);
                if (mode != this.themeService.CONTRAST_MODE) {
                    this.statusBar.backgroundColorByHexString(lightIndexColor[entry.indexScore])
                }
                else {
                    this.statusBar.backgroundColorByHexString(contrastModeColor)
                }
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
