import { Component, Input, OnInit, ViewChild } from '@angular/core';
import L from 'leaflet';
import { forkJoin } from 'rxjs';
import { BackgroundComponent } from '../../components/background/background.component';

import { UserCreatedFeedback } from '../../components/feedback/feedback.component';
import { UserLocation } from '../../Interfaces';
import { BelAqiIndexResult, BelAQIService } from '../../services/bel-aqi.service';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { BelaqiIndexService } from '../../services/value-provider/belaqi-index.service';
import { FeedbackStats } from './../../services/feedback/feedback.service';
import { NavController } from '@ionic/angular';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';

@Component({
  selector: 'app-rating-screen',
  templateUrl: './rating-screen.component.html',
  styleUrls: ['./rating-screen.component.scss', './rating-screen.component.hc.scss'],
})
export class RatingScreenComponent implements OnInit {
  locations: UserLocation[] = [];
  currentLocation!: UserLocation;
  currentActiveIndex!: BelAqiIndexResult;

  isFeedbackOpened = false;
  feedbackStats!: FeedbackStats;
  activeIndex!: number;
  feedbackLocation!: L.LatLng;
  ionContentRef!: any
  isContrastMode: boolean = false;

  public backgroundColor;

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
    private navCtrl: NavController,
    private themeHandlerService: ThemeHandlerService
  ) { }

  ngOnInit() {
    this.locations = this.userSettingsService.getUserSavedLocations();
    // activate first location by default
    this.activeIndex = this.locations.findIndex(e => this.userSettingsService.selectedUserLocation.id === e.id);
    this.updateCurrentLocation(this.locations[this.activeIndex]);

    this.userSettingsService.$userLocations.subscribe((locations) => {
      this.locations = locations;
    });
    this.belAqiService.$activeIndex.subscribe((newIndex) => {
      console.log('newIndex', newIndex)
      this.belAqi = newIndex?.indexScore});
    this.themeHandlerService.getActiveTheme().then(theme => {
      this.isContrastMode = theme === this.themeHandlerService.CONTRAST_MODE;
    })
  }

  private updateCurrentLocation(location: UserLocation) {
    this.belaqiIndexSrvc.getCurrentIndex(location).subscribe(
      res => {
        this.currentLocation = location;
        this.currentActiveIndex = res;
        this.belAqiService.activeIndex = this.currentActiveIndex;
      }
    );
  }

  // @ts-ignore
  onLocationChange(location: UserLocation) {
    this.updateCurrentLocation(location);
  }

  feedbackOpened() {
    this.isFeedbackOpened = true;
    this.background.scroll();
  }

  /**
   * Send feedback
   *
   * @param feedback
   */

  goToForm() {
    console.log('yuhuuuu')
    this.navCtrl.navigateForward('/main/rating/form');
  }

}
