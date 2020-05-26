import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {BelAQIService} from '../../services/bel-aqi.service';
import { backgroundImages } from '../../common/constants';

@Component({
    selector: 'app-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss'],
})
export class BackgroundComponent implements OnInit {
    @HostBinding('style.background-image')
    public backgroundImage;

    // deprecated input.. to remove
    @Input()
    set belAqi(index: number) {
        this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle(
            `url(${backgroundImages[index]})`
        );
    }

    constructor(private _sanitizer: DomSanitizer, private belAQIService: BelAQIService) {
        belAQIService.$activeIndex.subscribe( ( newIndex ) => {
            this.belAqi = newIndex.indexScore;
        });
    }

    ngOnInit() {}
}
