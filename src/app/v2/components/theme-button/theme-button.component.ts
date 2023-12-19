import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';

@Component({
  selector: 'app-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss', './theme-button.component.hc.scss'],
})
export class ThemeButtonComponent implements OnInit {
  public contrastIcon: any;
  constructor(
    private _sanitizer: DomSanitizer,
    private themeHandlerService: ThemeHandlerService,
    // private statusBar: StatusBar // different implementation with capacitor
  ) {
  }

  ngOnInit() {
    this.themeHandlerService.getActiveTheme().then((theme) => {
      console.log('default', theme)
      const contrastMode = this.themeHandlerService.CONTRAST_MODE;

      if (theme !== contrastMode || !theme) {
        // this.statusBar.backgroundColorByHexString('#44D0F4');
        StatusBar.setBackgroundColor({ color: '#44D0F4' });
        // this.statusBar.styleLightContent();
        StatusBar.setStyle({ style: Style.Light });
        this.themeHandlerService.setDefaultTheme();
        this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast-dark.svg`);
      } else {
        // this.statusBar.backgroundColorByHexString('#FFFFFF');
        StatusBar.setBackgroundColor({ color: '#FFFFFF' });
        // this.statusBar.styleDefault();
        StatusBar.setStyle({ style: Style.Default });
        this.themeHandlerService.setActiveTheme(contrastMode);
        this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast.svg`);
      }
    })
  }

  handleTheme() {
    this.themeHandlerService.getActiveTheme().then((theme) => {
      const contrastMode = this.themeHandlerService.CONTRAST_MODE;
      const standardMode = this.themeHandlerService.STANDARD_MODE;

      if (theme !== contrastMode || !theme) {
        // this.statusBar.backgroundColorByHexString('#FFFFFF');
        StatusBar.setBackgroundColor({ color: '#FFFFFF' });
        // this.statusBar.styleDefault();
        StatusBar.setStyle({ style: Style.Default });
        this.themeHandlerService.setActiveTheme(contrastMode);
        this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast.svg`);
      } else {
        // this.statusBar.backgroundColorByHexString('#44D0F4');
        StatusBar.setBackgroundColor({ color: '#44D0F4' });
        // this.statusBar.styleLightContent();
        StatusBar.setStyle({ style: Style.Light });
        this.themeHandlerService.setActiveTheme(standardMode);
        this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast-dark.svg`);
      }
    })
  }
}
