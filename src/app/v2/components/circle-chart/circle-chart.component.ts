import { Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { BelAQIService } from '../../services/bel-aqi.service';
import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { PushNotification } from './../../services/push-notifications/push-notifications.service';
import { NotificationPopoverComponent } from './../notification-popover/notification-popover.component';

@Component({
    selector: 'app-circle-chart',
    templateUrl: './circle-chart.component.html',
    styleUrls: ['./circle-chart.component.scss'],
})
export class CircleChartComponent implements OnInit {
    // belaqi score index
    @Input() belAqi = 0;
    // small circle text

    @Input() text: string;

    height: number;
    title: string;
    circumference = 1000;
    dashoffset = 0;
    circleOffset = 910;
    defaultOffset = 910;
    defaultRange = 92;

    pulsingText = {
        pulsing: false,
    };

    public notification: PushNotification;

    constructor(
        private belaqiService: BelAQIService,
        private translate: TranslateService,
        public element: ElementRef,
        private zone: NgZone,
        private generalNotification: GeneralNotificationService,
        public popoverController: PopoverController
    ) {
        belaqiService.$activeIndex.subscribe((newIndex) => {
            this.belAqi = newIndex.indexScore;
            this._initialize(this.belAqi);
        });
    }

    ngOnInit() {
        // this._initialize(this.belAqi);
        this.generalNotification.getNotifications().subscribe(notif => this.zone.run(() => this.notification = notif));
    }

    getChartHeight() {
        return this.element.nativeElement.offsetHeight || 315;
    }

    public openNotification(ev: Event) {
        this.popoverController.create({
            component: NotificationPopoverComponent,
            event: ev,
            componentProps: this.notification
        }).then(popover => popover.present());
    }

    private _initialize(belaqi: number) {
        const inverted = 11 - belaqi;

        const range = inverted * this.defaultRange;
        this.circleOffset = this.defaultOffset - range;
        this.dashoffset = inverted * this.defaultRange;

        this._changeTitle(belaqi);
    }

    private _changeTitle(value: number) {
        this.pulsingText.pulsing = true;

        this.title = this.belaqiService.getLabelForIndex(value);

        try {
            this.text = this.translate.instant(
                'v2.components.circle-chart.avg-score',
                { score: this.translate.instant(this.title) }
            );
        } catch (e) {
            console.log(e);
        }
    }
}
