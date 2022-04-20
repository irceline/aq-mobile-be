import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, IonReorderGroup, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BelAQIService } from '../../services/bel-aqi.service';
import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss', './header.component.hc.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

    @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

    private indexSubscription: Subscription;

    public locationsAvailable: boolean;

    // menuVisible = false;
    onRatingScreen = false;
    onMenuScreen = false;

    constructor(
        private navCtrl: NavController,
        private belAQIService: BelAQIService,
        private router: Router,
        private generalNotifService: GeneralNotificationService,
        private alertCtrl: AlertController,
        private translate: TranslateService,
        private activeRoute: ActivatedRoute,
        private zone: NgZone,
        private platform: Platform,
        private route: ActivatedRoute
    ) {
        router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((newRoute: NavigationEnd) => {
                this.onRatingScreen = newRoute.url === '/main/rating';
                this.onMenuScreen = newRoute.url.includes('/main/menu');
            });
    }

    ngOnInit() {
        this.indexSubscription = this.belAQIService.$activeIndex
            .subscribe((newIndex) => this.locationsAvailable = !!newIndex);
        this.generalNotifService.getNotifications().subscribe((notif) => {
            if (notif) {
                this.platform.resume.subscribe(() => {
                    this.navCtrl.navigateBack(this.router.url, { queryParams: { generalNotification: notif } })
                    setTimeout(() => this.router.navigate(['.'], { relativeTo: this.route, queryParams: { generalNotification: null, notification: null } }), 500)
                })
            }
        })
        this.activeRoute.queryParams.subscribe((params) => {
            if (params.generalNotification) this.presentGeneralNotif(params.generalNotification)
        })
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
        if (this.indexSubscription) { this.indexSubscription.unsubscribe(); }
    }

    toggleMenu() {
        if (this.onMenuScreen) {
            this.navCtrl.navigateBack(['main']);
        } else {
            this.navCtrl.navigateForward(['main/menu']);
        }
    }

    // closeMenu() {
    //     this.menuVisible = false;
    // }

    clickRating() {
        if (this.onRatingScreen) {
            this.navCtrl.navigateBack(['main']);
        } else {
            this.navCtrl.navigateForward(['main/rating']);
        }
        // this.menuVisible = false;
    }

    async presentGeneralNotif(notif) {
        const alert = await this.alertCtrl.create({
            header: notif.title,
            message: notif.body,
            buttons: [{
                text: this.translate.instant('controls.ok'),
                handler: () => {
                    alert.dismiss()
                },
            }],
        });
        await alert.present();
    }
}
