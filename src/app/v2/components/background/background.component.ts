import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss'],
})
export class BackgroundComponent implements OnInit {
    public backgroundCss;

    @HostBinding('style.background-image')
    public backgroundImage;

    @Input()
    set belAqi(index: number) {
        this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle(
            `url(${BackgroundComponent.getBackgroundForIndex(index)})`
        );
    }

    private static getBackgroundForIndex(index: number) {
        switch (index) {
            case 1:
                return '/assets/images/backgrounds/1.png';
            case 2:
                return '/assets/images/backgrounds/2.png';
            case 3:
                return '/assets/images/backgrounds/3.png';
            case 4:
                return '/assets/images/backgrounds/4.png';
            case 5:
                return '/assets/images/backgrounds/5.png';
            case 6:
                return '/assets/images/backgrounds/6.png';
            case 7:
                return '/assets/images/backgrounds/7.png';
            case 8:
                return '/assets/images/backgrounds/8.png';
            case 9:
                return '/assets/images/backgrounds/9.png';
            case 10:
                return '/assets/images/backgrounds/10.png';
            default:
                return null;
        }
    }

    constructor(private _sanitizer: DomSanitizer) {}

    ngOnInit() {}
}
