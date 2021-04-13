import { Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';

@Component({
    selector: 'app-theme-button',
    templateUrl: './theme-button.component.html',
    styleUrls: ['./theme-button.component.scss', './theme-button.component.hc.scss'],
})
export class ThemeButtonComponent implements OnInit {
    public contrastIcon;
    contrastText = 'Wissel naar hoog contrast';

    constructor(
        private _sanitizer: DomSanitizer,
        private themeHandlerService: ThemeHandlerService
    ) {
    }

    ngOnInit() {
        this.themeHandlerService.getActiveTheme().then(theme => {
            const contrastMode = this.themeHandlerService.CONTRAST_MODE;

            if (theme !== contrastMode || !theme) {
                this.themeHandlerService.setDefaultTheme();
                this.contrastText = 'Wissel naar hoog contrast';
                this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast-dark.svg`);
            } else {
                this.themeHandlerService.setActiveTheme(contrastMode);
                this.contrastText = 'Wissel naar standaard modus';
                this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast.svg`);
            }
        })
    }

    handleTheme() {
        this.themeHandlerService.getActiveTheme().then(theme => {
            const contrastMode = this.themeHandlerService.CONTRAST_MODE;
            const standardMode = this.themeHandlerService.STANDARD_MODE;

            if (theme !== contrastMode || !theme) {
                this.themeHandlerService.setActiveTheme(contrastMode);
                this.contrastText = 'Wissel naar standaard modus';
                this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast.svg`);
            } else {
                this.themeHandlerService.setActiveTheme(standardMode);
                this.contrastText = 'Wissel naar hoog contrast';
                this.contrastIcon = this._sanitizer.bypassSecurityTrustUrl(`/assets/images/contrast-dark.svg`);
            }
        })
    }
}
