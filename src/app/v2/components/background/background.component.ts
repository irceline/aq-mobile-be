import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { StatusBar, Style } from '@capacitor/status-bar';
import { backgroundImages, lightIndexColor, contrastModeColor, defaultColor } from '../../common/constants';
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
  // @ts-ignore
  private indexSubscription: Subscription;
  // @ts-ignore
  background: string;

  constructor(
    private _sanitizer: DomSanitizer,
    private belAQIService: BelAQIService,
    private themeService: ThemeHandlerService
  ) {
    belAQIService.$activeIndex.subscribe((newIndex) => {
      if (newIndex) this.background = this.belAQIService.getBackgroundForIndex(newIndex.indexScore);
    });
  }

  ngOnInit(): void {
    // this.statusBar.styleLightContent();
    StatusBar.setStyle({ style: Style.Light });
    this.indexSubscription = this.belAQIService.$activeIndex.subscribe(async (entry) => {
      if (entry) {
        this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl(`${backgroundImages[entry.indexScore]}`);
        this.statusBarSet(lightIndexColor[entry.indexScore])
      } else {
        this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/bg.svg`);
        this.statusBarSet(defaultColor)
      }
    });
  }

  statusBarSet(color: string): void {
    this.themeService.getActiveTheme().then((theme) => {
      if (theme === this.themeService.CONTRAST_MODE) {
        // this.statusBar.backgroundColorByHexString(contrastModeColor)
        StatusBar.setBackgroundColor({ color: contrastModeColor });
      }
      else {
        // this.statusBar.backgroundColorByHexString(color)
        StatusBar.setBackgroundColor({ color: color });
      }
    })
  }

  ngOnDestroy(): void {
    if (this.indexSubscription) {
      this.indexSubscription.unsubscribe();
    }
  }

}
