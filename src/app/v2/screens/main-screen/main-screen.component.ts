import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subject } from 'rxjs';

import { ValueDate } from '../../common/enums';
import { MainPhenomenon } from '../../common/phenomenon';
import { PullTabComponent } from '../../components/pull-tab/pull-tab.component';
import { DataPoint, Substance, UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { AnnualMeanValueService } from '../../services/value-provider/annual-mean-value.service';
import { ModelledValueService } from '../../services/value-provider/modelled-value.service';
import moment from 'moment';
import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { first } from 'rxjs/operators';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx'; // TODO find on capacitor
import { TimeLineListComponent } from '../../components/time-line-list/time-line-list.component';

interface IndexValueResult extends BelAqiIndexResult {
  value: number;
}

marker('v2.screens.app-info.ozon');
marker('v2.screens.app-info.nitrogen-dioxide');
marker('v2.screens.app-info.fine-dust');
marker('v2.screens.app-info.very-fine-dust');
marker('v2.screens.app-info.belaqi-title');

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss', './main-screen.component.hc.scss'],
  animations: []
})
export class MainScreenComponent implements OnInit {
  // @ts-ignore
  @ViewChild('backButton') backButton: ElementRef<HTMLElement>;
  @ViewChild(PullTabComponent) pullTab: any;
  @ViewChild('mainSlide') mainSlide!: TimeLineListComponent;
  @ViewChild('detailSlide') detailSlide!: TimeLineListComponent;

  // location data
  locations: UserLocation[] = [];

  // belAqi data
  belAqiForCurrentLocation!: BelAqiIndexResult[];
  // @ts-ignore
  currentActiveIndex: BelAqiIndexResult;

  valueTimeline: BelAqiIndexResult[] = [];
  // @ts-ignore
  selectedResult: IndexValueResult;

  detailedPhenomenona: Substance[] = [
    {
      name: 'v2.screens.app-info.nitrogen-dioxide',
      abbreviation: 'NO₂',
      unit: 'µg/m³',
      phenomenon: MainPhenomenon.NO2
    },
    {
      name: 'v2.screens.app-info.fine-dust',
      abbreviation: 'PM 10',
      unit: 'µg/m³',
      phenomenon: MainPhenomenon.PM10
    },
    {
      name: 'v2.screens.app-info.very-fine-dust',
      abbreviation: 'PM 2.5',
      unit: 'µg/m³',
      phenomenon: MainPhenomenon.PM25
    },
    {
      name: 'v2.screens.app-info.ozon',
      abbreviation: 'O₃',
      unit: 'µg/m³',
      phenomenon: MainPhenomenon.O3
    },
  ];

  // horizontal slider data
  slidesData = [
    {
      icon: '/assets/images/icons/sport-kleur.svg',
      title: 'Sporttip',
      text:
        '106 µg/m³ berekend op jouw locatie, gemiddeld is dit 78 µg/m³.',
    },
    {
      icon: '/assets/images/icons/sport-kleur.svg',
      title: 'Sporttip',
      text:
        '106 µg/m³ berekend op jouw locatie, gemiddeld is dit 78 µg/m³.',
    },
    {
      icon: '/assets/images/icons/sport-kleur.svg',
      title: 'Sporttip',
      text:
        '106 µg/m³ berekend op jouw locatie, gemiddeld is dit 78 µg/m³.',
    },
  ];

  // keep track of loading status
  detailDataLoading = false;

  detailData: DataPoint[] = [];
  // @ts-ignore
  belaqiDetailData: DataPoint;

  drawerOptions: any;

  protected belAqi = 10;
  detailPoint: DataPoint | null = null;
  detailActive = false;
  contentHeight = 0;
  screenHeight = 0;

  iosPadding = 0;
  pullTabOpen = false;

  slideEvent: Subject<number> = new Subject<number>();
  mapCenter = { latitude: 50.5039, longitude: 4.4699 };
  activeSlideIndex: number = ValueDate.CURRENT;

  constructor(
    public userSettingsService: UserSettingsService,
    private translateService: TranslateService,
    private belAqiService: BelAQIService,
    private modelledValueService: ModelledValueService,
    private annulMeanValueService: AnnualMeanValueService,
    private platform: Platform,
    public router: Router,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private generalNotificationSrvc: GeneralNotificationService
    // private splashScreen: SplashScreen
  ) {
    this.registerBackButtonEvent();

    this.locations = this.userSettingsService.getUserSavedLocations();

    this.userSettingsService.$userLocations.subscribe((locations) => {
      this.updateCurrentLocation();
      return this.locations = locations;
    });

    // this.platform.ready().then(()=>{
    //     setTimeout(() => this.splashScreen.hide(), 1500)
    // })
  }

  registerBackButtonEvent() {
    this.platform.backButton.subscribe(() => {
      if (this.router.url === '/main') {
        if (this.detailActive) {
          let el: HTMLElement = this.backButton.nativeElement;
          el.click();
        } else {
          if (this.pullTabOpen) this.closeTabAction();
          else navigator['app'].exitApp();
        }
      }
    });
  }

  backDetailAction() {
    this.detailActive = false;
    this.detailPoint = null;
  }

  closeTabAction() {
    this.pullTab.handlePan({ additionalEvent: 'pandown', center: { y: 0 } })
  }

  private updateCurrentLocation(loadFinishedCb?: () => any) {

    if (this.userSettingsService.selectedUserLocation) {
      const index = this.locations.findIndex(d => d.label === this.userSettingsService.selectedUserLocation.label);

      this.slideEvent.next(index);

      return this.belAqiService.getIndexScoresAsObservable(this.userSettingsService.selectedUserLocation).subscribe(
        res => {
          // Handling if there is null data main timeline
          const data = res.filter(e => e !== null);
          const belAqiData = [...res];
          belAqiData.forEach((item, index) => {
            if (!item) belAqiData[index] = { indexScore: 0, location: data[0].location, valueDate: index }
          })

          this.belAqiForCurrentLocation = belAqiData;
          this.updateDetailData(loadFinishedCb);
        }, error => {
          console.error('Error occured while fetching the bel aqi indicies');
          if (loadFinishedCb) { loadFinishedCb(); }
          this.showErrorAlert()
        });
    } else {
      // @ts-ignore
      this.belAqiService.activeIndex = null;
    }

    return true
  }

  private async updateDetailData(loadFinishedCb?: () => any) {
    this.detailDataLoading = true;

    let currentActiveIndex = ValueDate.CURRENT;
    if (this.currentActiveIndex) {
      if (typeof this.currentActiveIndex.valueDate != 'undefined') {
        currentActiveIndex = this.currentActiveIndex.valueDate;
      }
    }

    let currentBelAqi = this.belAqiForCurrentLocation.find(e => e.valueDate === currentActiveIndex);
    // if current is not available
    if (currentBelAqi === undefined && this.belAqiForCurrentLocation.length > 0) {
      currentBelAqi = this.belAqiForCurrentLocation[0];
    }
    // @ts-ignore
    this.belAqiService.activeIndex = currentBelAqi;

    this.belaqiDetailData = {
      // @ts-ignore
      color: this.belAqiService.getLightColorForIndex(currentBelAqi.indexScore),
      // @ts-ignore
      evaluation: this.belAqiService.getLabelForIndex(currentBelAqi.indexScore),
      location: this.userSettingsService.selectedUserLocation,
      mainTab: true,
      showValues: false,
      showThreshold: false,
      // @ts-ignore
      euBenchMark: null,
      // @ts-ignore
      worldBenchMark: null,
      substance: {
        name: 'v2.screens.app-info.belaqi-title',
        abbreviation: 'BelAQI',
        phenomenon: MainPhenomenon.BELAQI
      }
    };

    this.annulMeanValueService.getLastValue(this.userSettingsService.selectedUserLocation, MainPhenomenon.BELAQI_DAY).subscribe(
      value => {
        this.belaqiDetailData.lastAnnualIndex = {
          color: this.belAqiService.getLightColorForIndex(value.index),
          label: this.belAqiService.getLabelForIndex(value.index)
        };
      });

    this.detailedPhenomenona.forEach(dph => {
      forkJoin([
        this.modelledValueService.getValueByDate(this.userSettingsService.selectedUserLocation, dph.phenomenon, currentActiveIndex),
        this.annulMeanValueService.getLastValue(this.userSettingsService.selectedUserLocation, dph.phenomenon)
      ]).subscribe(
        res => {

          if (res[0] != null) {
            const idx = this.detailData.findIndex(e => e.substance.phenomenon === dph.phenomenon);
            const entry = {
              location: this.userSettingsService.selectedUserLocation,
              currentValue: Math.round(res[0].value),
              averageValue: res[1] ? Math.round(res[1].value) : null,
              substance: dph,
              mainTab: true,
              showValues: false,
              showThreshold: false,
              euBenchMark: null,
              worldBenchMark: null,
              evaluation: this.belAqiService.getLabelForIndex(res[0].index),
              color: this.belAqiService.getLightColorForIndex(res[0].index)
            };
            if (idx > -1) {
              // @ts-ignore
              this.detailData[idx] = entry;
            } else {
              // @ts-ignore
              this.detailData.push(entry);
            }
          }
          this.detailDataLoading = false;
          if (loadFinishedCb) { loadFinishedCb(); }
        },
        error => {
          console.error(error);
          if (loadFinishedCb) { loadFinishedCb(); }
        });
    });
  }

  ngOnInit() {
    this.drawerOptions = {
      handleHeight: 150,
      gap: 120,
      thresholdFromBottom: 300,
      thresholdFromTop: 50,
      bounceBack: true,
    };
    if (this.platform.is('ios')) {
      this.contentHeight =
        this.platform.height() - this.drawerOptions.handleHeight - 106;
      this.iosPadding = 50;
    } else {
      this.contentHeight =
        this.platform.height() - this.drawerOptions.handleHeight - 56;
    }
    this.screenHeight = this.platform.height();


    this.generalNotificationSrvc.$active.pipe(first()).subscribe(async (res) => {
      if (!res) {
        const asked = await this.generalNotificationSrvc.getAskedEnableNotif()
        if (!asked || asked === '') setTimeout(() => this.showPushNotifAlert(), 3000)
      }
    })

    this.belAqiService.$activeIndex.subscribe(newIndex => {
      if (newIndex) {
        this.updateDetailData();
      }
    });
  }

  ionViewWillEnter() {
    this.updateCurrentLocation();
  }

  doRefresh(event) {
    this.updateCurrentLocation(() => event.target.complete());
  }

  // @ts-ignore
  onLocationChange(location: UserLocation) {
    this.userSettingsService.selectedUserLocation = location;
    this.updateCurrentLocation();
  }

  onDayChange(index: BelAqiIndexResult) {
    this.currentActiveIndex = index;
    this.belAqiService.activeIndex = index;
    if (index.valueDate === 0 || index.valueDate) {
      this.detailSlide?.slideTo(index.valueDate);
      this.activeSlideIndex = index.valueDate;
    }
  }

  openDetails(selectedDataPoint: DataPoint) {
    if (this.detailDataLoading) {
      this.activeSlideIndex = ValueDate.CURRENT;
    }
    this.detailPoint = selectedDataPoint;
    this.modelledValueService.getValueTimeline(
      this.userSettingsService.selectedUserLocation,
      selectedDataPoint.substance.phenomenon
    ).subscribe(res => {
      // Handling if there is null data in details
      const belAqiData = [...res];
      belAqiData.forEach((item, index) => {
        if (!item) belAqiData[index] = { index: 0, value: 0, valueDate: index, date: moment() }
      })
      this.valueTimeline = belAqiData
        .filter(e => e !== null)
        .map(e => ({
          date: e.date,
          indexScore: e.index,
          value: e.value,
          valueDate: e.valueDate,
          location: this.userSettingsService.selectedUserLocation,
        }));

      this.detailActive = true;
      this.detailSlide?.slideTo(this.activeSlideIndex);
    });
  }

  openBelaqiDetails() {
    // Not sure why previously when opening the belaqi details, the active slide index was set to the current value?
    // Related commit: https://github.com/irceline/aq-mobile-be/commit/96f1d5004f715391851eea2a40b92a348d178598#diff-2d30ee05edbfec46a8a8367f7adfefc9245cf3c770f59a24bfdd945c74cf362cR342-R365
    if (this.detailDataLoading) {
      this.activeSlideIndex = ValueDate.CURRENT;
    }
    this.detailActive = true;
    this.detailPoint = this.belaqiDetailData;
    this.valueTimeline = this.belAqiForCurrentLocation;
  }

  // onDetailsDayChange(index: IndexValueResult) {
  onDetailsDayChange(index: any) {
    this.selectedResult = index;

    this.detailPoint = {
      ...this.detailPoint,
      color: this.belAqiService.getLightColorForIndex(index.indexScore),
      evaluation: this.belAqiService.getLabelForIndex(index.indexScore),
      location: this.userSettingsService.selectedUserLocation,
      // @ts-ignore
      currentValue: isNaN(index.value) ? null : Math.round(index.value),
    }
    if (index.valueDate === 0 || index.valueDate) {
      this.mainSlide?.slideTo(index.valueDate);
      this.activeSlideIndex = index.valueDate;
    }
  }

  useLocation(location: UserLocation) {
    if (location) {
      this.userSettingsService.addUserLocation(location);
    }
  }

  updateClicked(value: boolean) {
    this.pullTabOpen = value
  }

  async showPushNotifAlert() {
    const alert = await this.alertCtrl.create({
      header: this.translateService.instant('v2.screens.menu.notifications'),
      message: this.translateService.instant('v2.screens.onboarding.ask-notifications'),
      buttons: [{
        text: this.translateService.instant('controls.no'),
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          this.generalNotificationSrvc.setAskedEnableNotif('1')
          alert.dismiss()
        },
      },
      {
        text: this.translateService.instant('controls.yes'),
        handler: () => this.navCtrl.navigateForward('main/menu', { fragment: 'notification' }),
      },],
    });
    await alert.present();
  }

  async showErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: this.translateService.instant('error-modal.title'),
      message: this.translateService.instant('error-modal.no-network-connection'),
      buttons: [
        {
          text: this.translateService.instant('error-modal.back-to-app'),
          role: 'confirm',
          handler: () => {
            this.updateDetailData()
          },
        },
      ],
    });

    await alert.present();
  }
}
