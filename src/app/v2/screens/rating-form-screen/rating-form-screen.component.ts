import { Component, Input, OnInit, ViewChild } from '@angular/core';
import L from 'leaflet';
import { forkJoin } from 'rxjs';
import { BackgroundComponent } from '../../components/background/background.component';

import { UserCreatedFeedback } from '../../components/feedback/feedback.component';
import { UserLocation } from '../../Interfaces';
import {
  BelAqiIndexResult,
  BelAQIService,
} from '../../services/bel-aqi.service';
import {
  FeedbackCode,
  FeedbackService,
} from '../../services/feedback/feedback.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { BelaqiIndexService } from '../../services/value-provider/belaqi-index.service';
import { FeedbackStats } from '../../services/feedback/feedback.service';
import { TranslateService } from '@ngx-translate/core';
import {
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { FeedbackCalendarComponent } from '../../components/feedback-calendar/feedback-calendar.component';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';
import { GeocoderService } from '../../services/geocoder/geocoder.service';
import {
  LocateService,
  LocationStatus,
} from '../../services/locate/locate.service';
import * as moment from 'moment';

export interface CauseItem {
  val: string;
  icon: string;
  selected: boolean;
  code: number;
}

@Component({
  selector: 'app-rating-form-screen',
  templateUrl: './rating-form-screen.component.html',
  styleUrls: [
    './rating-form-screen.component.scss',
    './rating-form-screen.component.hc.scss',
  ],
})
export class RatingFormScreenComponent implements OnInit {
  locations: UserLocation[] = [];
  currentLocation!: UserLocation;
  currentActiveIndex!: BelAqiIndexResult;

  isFeedbackOpened = false;
  feedbackStats!: FeedbackStats;
  activeIndex!: number;
  feedbackLocation!: L.LatLng;
  ionContentRef!: any;
  feedback!: UserCreatedFeedback;
  showMap: boolean = false;
  feedbackCode = FeedbackCode;
  isContrastMode: boolean = false;
  selectedCause: number[] = [];
  public backgroundColor = '';
  isLocationAllowed: boolean = false;
  loadingLocation: boolean = false;
  locationName: string = this.translateSrvc.instant(
    'v2.screens.rating-screen.no-location-found'
  );
  selectedDate: Date = new Date();
  startDate: Date = new Date();
  endDate: Date = new Date();
  dateLabel: string = this.translateSrvc.instant(
    'v2.screens.rating-screen.now'
  );
  lang: string = this.translateSrvc.currentLang
    ? this.translateSrvc.currentLang
    : 'en';
  situation: string = '';
  otherCause: string = '';
  isOutsideBelgium: boolean = false;
  causes = [
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.fire'),
      code: FeedbackCode.WOODBURN,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.exhaust'),
      code: FeedbackCode.TRAFFIC,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.industry'),
      code: FeedbackCode.INDUSTRY,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.agriculture'),
      code: FeedbackCode.AGRICULTURE,
    },
    {
      val: this.translateSrvc.instant('v2.screens.rating-screen.other'),
      code: FeedbackCode.NOT_INLINE_WITHOUT_INFO,
    },
  ];

  @Input()
  set belAqi(index: number) {
    this.backgroundColor = this.belAqiService.getLightColorForIndex(index);
  }

  @ViewChild('background') private background!: BackgroundComponent;

  constructor(
    private userSettingsService: UserSettingsService,
    private belAqiService: BelAQIService,
    private belaqiIndexSrvc: BelaqiIndexService,
    private feedbackSrvc: FeedbackService,
    private translateSrvc: TranslateService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private themeHandlerService: ThemeHandlerService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private geocoder: GeocoderService,
    private locateSrvc: LocateService
  ) {}

  ngOnInit() {
    this.locations = this.userSettingsService.getUserSavedLocations();
    // activate first location by default
    this.activeIndex = this.locations.findIndex(
      (e) => this.userSettingsService.selectedUserLocation.id === e.id
    );
    this.updateCurrentLocation(this.locations[this.activeIndex]);

    this.userSettingsService.$userLocations.subscribe((locations) => {
      this.locations = locations;
    });
    this.belAqiService.$activeIndex.subscribe(
      (newIndex) => (this.belAqi = newIndex?.indexScore)
    );
    this.themeHandlerService.getActiveTheme().then((theme) => {
      this.isContrastMode = theme === this.themeHandlerService.CONTRAST_MODE;
    });
    this.getCurrentLocation();
    this.isLocationAllowed =
      this.locateSrvc.getLocationStatus() === LocationStatus.HIGH_ACCURACY;
  }

  private updateCurrentLocation(location: UserLocation) {
    this.belaqiIndexSrvc.getCurrentIndex(location).subscribe((res) => {
      this.currentLocation = location;
      this.currentActiveIndex = res;
      this.belAqiService.activeIndex = this.currentActiveIndex;
    });
  }

  // @ts-ignore
  onLocationChange(location: { latitude: number; longitude: number }) {
    this.locationName = this.geocoder.getLocationLabel(
      location.latitude,
      location.longitude
    ).label;
    this.currentLocation = {...this.currentLocation, ...location}
  }

  async onSubmit() {
    const valid = this.validateFeedback();
    if (!valid) return;
    const loading = await this.loadingController.create({
      message: this.translateSrvc.instant(
        'v2.components.location-input.please-wait'
      ),
    });
    await loading.present();
    const startHour = this.startDate.getHours();
    const endHour = this.endDate.getHours();
    const date_start = new Date(this.selectedDate);
    date_start.setHours(startHour);
    const date_end = new Date(this.selectedDate);
    date_end.setHours(endHour)

    const feedbackSubmits = this.selectedCause.map((fbcode) =>
      this.feedbackSrvc.sendFeedback({
        lat: this.currentLocation.latitude || 0,
        lng: this.currentLocation.longitude || 0,
        feedback_code: fbcode,
        situation: this.situation,
        others_cause: this.otherCause,
        date_start: date_start.toISOString(),
        date_end: date_end.toISOString(),
      })
    );

    try {
      forkJoin(feedbackSubmits).subscribe({
        next: (stats) => {
          if (stats.length >= 1) {
            this.feedbackStats = stats[0];
            console.log(this.feedbackStats);
          }
          this.feedbackLocation = new L.LatLng(
            this.currentLocation.latitude || 0,
            this.currentLocation.longitude || 0
          );
          this.loadingController.dismiss();
          this.navCtrl.navigateForward('/main/rating/success');
        },
        error: (err) => {
          console.error('forkJoin error:', err);
          this.toastController
            .create({
              message: this.translateSrvc.instant(
                'v2.screens.rating-screen.error-send-feedback'
              ),
              duration: 2000,
            })
            .then((toast) => toast.present());
          this.loadingController.dismiss();
        },
      });
    } catch (error) {
      console.log('error', error);
      this.loadingController.dismiss();
      this.toastController
        .create({
          message: this.translateSrvc.instant(
            'v2.screens.rating-screen.error-send-feedback'
          ),
          duration: 2000,
          position: 'top',
        })
        .then((toast) => toast.present());
      console.error(error);
    }
  }

  selectCause(code: number) {
    if (this.selectedCause.includes(code)) {
      this.selectedCause = this.selectedCause.filter((item) => item !== code);
    } else {
      this.selectedCause.push(code);
    }
  }

  openMaps() {
    this.showMap = true;
  }

  openCalendar() {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    this.modalController
      .create({
        component: FeedbackCalendarComponent,
        componentProps: {
          color: this.backgroundColor,
          minDate: oneWeekAgo.toISOString().split('T')[0],
          maxDate: today.toISOString().split('T')[0],
          initialDate: this.selectedDate,
          initialStartDate: this.startDate,
          initialEndDate: this.endDate,
        },
        cssClass: 'bottom-sheet-modal',
        breakpoints: [0, 1],
        initialBreakpoint: 1,
      })
      .then((modal) => {
        modal.present();

        modal.onDidDismiss().then((dismissed) => {
          if (dismissed && dismissed.data) {
            const { selectedDate, startDate, endDate } = dismissed.data;

            const start = new Date(startDate);
            const end = new Date(endDate);

            console.log('start.getHours()', start.getHours());
            console.log('end.getHours()', end.getHours());

            if (start.getHours() !== end.getHours()) {
              console.log('same???');
              this.selectedDate = new Date(selectedDate);
              this.startDate = start;
              this.endDate = end;

              this.dateLabel = `${moment(selectedDate)
                .locale(this.lang || 'en')
                .format('ddd DD MMM')} ${moment(this.startDate)
                .locale(this.lang || 'en')
                .format('HH:mm')}–${moment(this.endDate)
                .locale(this.lang || 'en')
                .format('HH:mm')}`;
            } else {
              console.log('here');
              this.selectedDate = new Date();
              this.startDate = new Date();
              this.endDate = new Date();
              this.dateLabel = this.translateSrvc.instant(
                'v2.screens.rating-screen.now'
              );
            }
          }
        });
      });
  }

  async getCurrentLocation() {
    const loading = await this.loadingController.create({
      message: this.translateSrvc.instant(
        'v2.components.location-input.please-wait'
      ),
    });
    await loading.present();

    this.locateSrvc.getUserLocation().subscribe(
      (resp) => {
        this.geocoder
          .reverse(resp.coords.latitude, resp.coords.longitude, {
            acceptLanguage: this.translateSrvc.currentLang,
          })
          .subscribe((loc) => {
            if (this.geocoder.insideBelgium(loc.latitude, loc.longitude)) {
              this.locationName = loc.label;
              this.toastController
                .create({
                  message: this.translateSrvc.instant(
                    'v2.components.location-input.success-add-location'
                  ),
                  duration: 2000,
                })
                .then((toast) => toast.present());
              this.currentLocation = {
                id: new Date().getTime(),
                label: loc.label,
                type: 'user',
                latitude: loc.latitude,
                longitude: loc.longitude,
              };
              this.isLocationAllowed = true;
              this.isOutsideBelgium = false;
              loading.dismiss();
            } else {
              this.toastController
                .create({
                  message: this.translateSrvc.instant(
                    'v2.screens.rating-screen.current-location-outside-belgium'
                  ),
                  duration: 2000,
                })
                .then((toast) => toast.present());
              loading.dismiss(null, 'cancel');
              this.isLocationAllowed = true;
              this.isOutsideBelgium = true;
            }
          });
      },
      (error) => {
        loading.dismiss(null, 'cancel');
      }
    );
  }

  validateFeedback() {
    if (this.isOutsideBelgium) {
      this.toastController
        .create({
          message: this.translateSrvc.instant(
            'v2.screens.rating-screen.current-location-outside-belgium'
          ),
          duration: 2000,
        })
        .then((toast) => toast.present());
      return false;
    }
    if (
      this.selectedCause.includes(FeedbackCode.NOT_INLINE_WITHOUT_INFO) &&
      !this.otherCause
    ) {
      this.toastController
        .create({
          message: this.translateSrvc.instant(
            'v2.screens.rating-screen.specify-the-cause'
          ),
          duration: 2000,
        })
        .then((toast) => toast.present());
      return false;
    }
    if (this.selectedCause.length === 0) {
      this.toastController
        .create({
          message: this.translateSrvc.instant(
            'v2.screens.rating-screen.select-cause'
          ),
          duration: 2000,
        })
        .then((toast) => toast.present());
      return false;
    }
    return true;
  }
}
