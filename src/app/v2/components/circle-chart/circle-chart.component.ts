import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Settings, SettingsService } from '@helgoland/core';
import { Platform, PopoverController } from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { select, scaleLinear, path, arc, interpolate } from 'd3';
import { Subscription } from 'rxjs';

import { ThemeHandlerService } from '../..//services/theme-handler/theme-handler.service';
import { MainPhenomenon } from '../../common/phenomenon';
import { UserLocation } from '../../Interfaces';
import { BelAQIService } from '../../services/bel-aqi.service';
import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { PushNotification } from './../../services/push-notifications/push-notifications.service';
import { AnnualMeanValueService } from './../../services/value-provider/annual-mean-value.service';
import { NotificationPopoverComponent } from './../notification-popover/notification-popover.component';

@Component({
    selector: 'app-circle-chart',
    templateUrl: './circle-chart.component.html',
    styleUrls: ['./circle-chart.component.scss', './circle-chart.component.hc.scss'],
})
export class CircleChartComponent implements OnInit {
    @ViewChild('titleRef') titleRef: ElementRef;
    @ViewChild('titleWrapperRef') titleWrapperRef: ElementRef;
    @ViewChild('chartRef') chartRef: ElementRef;
    // belaqi score index
    belAqi = 0;
    // small circle text

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
    circleActive = false;
    isIos = false;
    titleSize = 40;
    text: string;

    belAqiSubs: Subscription;
    belAqiScale;
    strokeSize = 15;
    wheel;
    wheelArc;
    radius = 0;
    circleMarker;
    dotRadius = 15;
    radScale;
    cornerRadius = 10;

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
        private themeHandlerService: ThemeHandlerService,
        private platform: Platform,
        private annualMeanValueSrvc: AnnualMeanValueService,
        private settingsSrvc: SettingsService<Settings>,
        private route: ActivatedRoute
    ) {
        this.belaqiService.$activeIndex.subscribe((newIndex) => {
            if (newIndex) {
                this.belAqi = newIndex.indexScore;
                this.activeUserLocation = newIndex.location;

                this.loadAnnualValue(this.activeUserLocation);
                this._initializeChart(() => {
                    this._initialize();
                })
            }
        });

        themeHandlerService.$theme.subscribe((item: any) => {
            if (item === this.themeHandlerService.CONTRAST_MODE) {
                this.chartColor = this.belaqiService.getLightColorForIndex(this.belAqi);
            } else {
                this.chartColor = '#FFFFFF'
            }

            if (this.wheel && this.circleMarker) {
                this.circleMarker.attr('fill', this.chartColor)
                this.wheel.attr('fill', this.chartColor)
            }
        })

        translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this._initializeChart(() => {
                this._initialize();
            })
        })
    }

    ngAfterViewInit() {
        this._initializeChart(() => {
            this._initialize();
        })
        this.route.queryParams.subscribe(params => {
            this.zone.run(() => {
                if (params.notification) {
                    this.activeUserLocation.notification = params.notification
                    document.getElementById('notif-btn').dispatchEvent(new Event('click'))
                }
            })
        })
    }

    ngOnInit() {
        this.generalNotification.getNotifications().subscribe(notif => this.zone.run(() => this.notification = notif));
        this.generalNotification.$active.subscribe(active => this.notificationActive = active);
        this.isIos = this.platform.is('ios');
    }

    getChartHeight() {
        return this.element.nativeElement.offsetHeight || 315;
    }

    public openNotification(ev: Event) {
        try {
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
        } catch (error) {

        }
    }

    private _initializeChart(cb?) {
        if (!this.chartRef) {
            console.log('chart ref not exist!!!')
            return;
        }

        const svg = select(this.chartRef.nativeElement)

        if (svg.select('#chart-stage').attr('data-loaded') != null) {
            cb();
            return
        }

        this.belAqiScale = scaleLinear().range([Math.PI * -0.98, Math.PI * 0.98]).domain([11, 0])
        this.radScale = scaleLinear().range([0, 360]).domain([Math.PI * -0.98, Math.PI * 0.98])

        const svgWidth = Math.min(window.innerWidth, 480)
        const svgHeight = (svgWidth * 0.8) + (this.dotRadius * 2)

        svg
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)

        const center = svgWidth / 2;
        this.radius = (svgWidth * 0.8) / 2;

        const p = path();
        p.arc(0, 0, this.radius - (this.strokeSize / 2), Math.PI * 0.55, 3.14 * 2.45)

        const g = svg.select('#chart-stage')
            .attr('transform', `translate(${center}, ${svgHeight / 2})`)
            .attr('data-loaded', true)

        this.wheelArc = arc()
            .innerRadius(this.radius - this.strokeSize)
            .outerRadius(this.radius)
            .cornerRadius(this.cornerRadius);

        const railArc = path();
        railArc.arc(0, 0, this.radius - (this.strokeSize / 2), Math.PI * 0.55, 3.14 * 2.45)

        const k = ((Math.PI * 0.9625) * 2) * this.radius;

        // base wheel
        g.append("path")
            .attr('fill', 'rgba(0,0,0,0.1)')
            .attr("stroke-width", 1)
            .attr("stroke", "rgba(0,0,0,0.1)")
            .datum({ startAngle: this.belAqiScale(11), endAngle: this.belAqiScale(0) })
            .attr("d", this.wheelArc)

        this.wheel = g.append("path")
            .attr('fill', this.chartColor)
            .attr("stroke-width", 1)
            .attr("stroke", "white")
            .datum({ startAngle: this.belAqiScale(11), endAngle: this.belAqiScale(11) })
            .attr("d", this.wheelArc)

        g.append('path')
            .attr('fill', 'none')
            .attr('stroke', 'rgba(0,0,0,0.2)')
            .attr('stroke-width', '5')
            .attr('stroke-linejoin', 'bevel')
            .attr('stroke-dasharray', `2, ${k / 11}`)
            .style('mix-blend-mode', 'multiply')
            .attr('d', railArc)

        this.circleMarker = g
            .append('circle')
            .attr('fill', this.chartColor)
            .attr('r', this.dotRadius)
            .attr('cx', this.wheelArc.centroid({ startAngle: Math.PI * -0.975, endAngle: Math.PI * 0.975 })[0])
            .attr('cy', this.wheelArc.centroid({ startAngle: Math.PI * -0.975, endAngle: Math.PI * 0.975 })[1])

        this._initialize();
    }

    private _initialize() {
        const inverted = 11 - this.belAqi;

        this.wheel
            .transition()
            .duration(1000)
            .attrTween('d', (d) => {
                const interpolator = interpolate(d.endAngle, this.belAqiScale(this.belAqi));

                const start = {
                    startAngle: d.endAngle, endAngle: d.endAngle,
                };
                const end = {
                    startAngle: this.belAqiScale(this.belAqi), endAngle: this.belAqiScale(this.belAqi)
                }

                const circleInterpolator = interpolate(start, end);

                return t => {
                    const cent = this.wheelArc.centroid(circleInterpolator(t));
                    this.circleMarker.attr('cx', cent[0]).attr('cy', cent[1])

                    d.endAngle = interpolator(t);
                    return this.wheelArc(d);
                }
            })

        const range = inverted * this.defaultRange;
        this.circleOffset = this.defaultOffset - range;
        this.dashoffset = inverted * this.defaultRange;

        this.themeHandlerService.getActiveTheme().then(theme => {
            if (theme !== this.themeHandlerService.CONTRAST_MODE || !theme) {
                this.chartColor = '#FFFFFF';
            } else {
                this.chartColor = this.belaqiService.getLightColorForIndex(this.belAqi);
            }

            this.circleMarker.attr('fill', this.chartColor)
            this.wheel.attr('fill', this.chartColor)
        })

        this._changeTitle(this.belAqi);
        setTimeout(() => {
            this.circleActive = true;
        }, 2000)
    }

    private _changeTitle(value: number) {
        const lang = this.translate.currentLang;
        this.loading = true
        this.pulsingText.pulsing = true;

        this.title = this.belaqiService.getLabelForIndex(value);

        // Handle dynamic size
        this.titleSize = 40;
        setTimeout(() => {
            const width = this.titleRef.nativeElement.offsetWidth;
            this.handleTitleSize(width);
        }, 400)

        this.loading = false
    }

    private loadAnnualValue(loc: UserLocation) {
        this.annualMeanValueSrvc.getLastValue(loc, MainPhenomenon.BELAQI).subscribe(res => this.setSubtitle(res.index))
    }

    private setSubtitle(annualValue): void {
        if (annualValue !== undefined && this.belAqi !== 0) {
            const annualLabel = this.belaqiService.getLabelForIndex(annualValue);
            if (annualLabel) {
                this.text = this.translate.instant(
                    'v2.components.circle-chart.avg-score',
                    { score: this.translate.instant(annualLabel).toLowerCase() }
                );
            }
        } else if (this.belAqi === 0) {
            this.text = this.translate.instant('belaqi.no-data-available');
        }
    }

    handleTitleSize(width) {
        const wrapper = this.titleWrapperRef.nativeElement.offsetWidth;
        const size = wrapper * 0.1;

        if (width > 205) this.titleSize = size;
        else this.titleSize = 40;

        if (this.platform.is('ipad') || this.platform.is('tablet')) this.titleSize = 52;
    }
}
