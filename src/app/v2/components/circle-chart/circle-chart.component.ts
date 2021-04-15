import { Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UserLocation } from '../../Interfaces';
import { BelAQIService } from '../../services/bel-aqi.service';
import { ThemeHandlerService } from '../..//services/theme-handler/theme-handler.service';
import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { PushNotification } from './../../services/push-notifications/push-notifications.service';
import { NotificationPopoverComponent } from './../notification-popover/notification-popover.component';
import { runInThisContext } from 'vm';

@Component({
    selector: 'app-circle-chart',
    templateUrl: './circle-chart.component.html',
    styleUrls: ['./circle-chart.component.scss', './circle-chart.component.hc.scss'],
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
    loading = true;
    pulsingText = {
        pulsing: false,
    };
    chartColor = '#FFFFFF';

    public activeUserLocation: UserLocation;

    public notification: PushNotification;
    public notificationActive: boolean;

    constructor(
        private belaqiService: BelAQIService,
        private translate: TranslateService,
        public element: ElementRef,
        private zone: NgZone,
        private generalNotification: GeneralNotificationService,
        public popoverController: PopoverController,
        private themeHandlerService: ThemeHandlerService
    ) {
        belaqiService.$activeIndex.subscribe((newIndex) => {
            if (newIndex) {
                this.belAqi = newIndex.indexScore;
                this.activeUserLocation = newIndex.location;
                this._initialize(this.belAqi);
            }
        });

        themeHandlerService.$theme.subscribe((item : any) => {
            if (item === this.themeHandlerService.CONTRAST_MODE) {
                this.chartColor = this.belaqiService.getLightColorForIndex(this.belAqi);
            } else {
                this.chartColor = '#FFFFFF'
            }
        })
    }

    ngOnInit() {
        this.generalNotification.getNotifications().subscribe(notif => this.zone.run(() => this.notification = notif));
        this.generalNotification.$active.subscribe(active => this.notificationActive = active);
    }

    getChartHeight() {
        return this.element.nativeElement.offsetHeight || 315;
    }

    public openNotification(ev: Event) {
        const notifications = [];
        if (this.notification) {
            notifications.push(this.notification);
        }
        if (this.activeUserLocation.notification) {
            notifications.push(this.activeUserLocation.notification);
        }
        this.popoverController.create({
            component: NotificationPopoverComponent,
            event: ev,
            componentProps: { notifications }
        }).then(popover => popover.present());
    }

    private _initialize(belaqi: number) {
        const inverted = 11 - belaqi;

        const range = inverted * this.defaultRange;
        this.circleOffset = this.defaultOffset - range;
        this.dashoffset = inverted * this.defaultRange;

        this.themeHandlerService.getActiveTheme().then(theme => {
            if (theme !== this.themeHandlerService.CONTRAST_MODE || !theme) {
                this.chartColor = '#FFFFFF';
            } else {
                this.chartColor = this.belaqiService.getLightColorForIndex(belaqi);
            }
        })

        this._changeTitle(belaqi);
    }

    private _changeTitle(value: number) {
        this.loading = true
        this.pulsingText.pulsing = true;

        this.title = this.belaqiService.getLabelForIndex(value);
        this.loading = false
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
