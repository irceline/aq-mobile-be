import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// import { AppVersion } from '@ionic-native/app-version/ngx';
import { App } from '@capacitor/app';
import { IonContent, NavController, Platform } from '@ionic/angular';

// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StatusBar, Style } from '@capacitor/status-bar';
import { contrastModeColor } from '../../common/constants'
import { UserLocation } from '../../Interfaces';
import { BelAQIService } from '../../services/bel-aqi.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-screen',
  templateUrl: './menu-screen.component.html',
  styleUrls: ['./menu-screen.component.scss', './menu-screen.component.hc.scss'],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate(
          '0ms',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms',
          style({ opacity: 0, transform: 'translateX(-100%)' })
        ),
      ]),
    ]),
  ],
})
export class MenuScreenComponent implements OnInit {
  @Output() menuClosed = new EventEmitter();
  // @ts-ignore
  @ViewChild(IonContent) content: IonContent;

  public backgroundColor;

  @Input()
  set belAqi(index: number) {
    this.backgroundColor = this.belAQIService.getLightColorForIndex(index);
  }

  @Input() menuVisible = false;

  // todo: user settings service get this from language settings
  language = 'e';

  locationList: UserLocation[] = [];

  version:string = 'mobile';

  constructor(
    private navCtrl: NavController,
    private belAQIService: BelAQIService,
    private userSettingsService: UserSettingsService,
    // private appVersion: AppVersion,
    private platform: Platform,
    private themeService: ThemeHandlerService,
    // private statusBar: StatusBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.belAQIService.$activeIndex.subscribe((newIndex) => this.belAqi = newIndex?.indexScore);

    this.locationList = this.userSettingsService.getUserSavedLocations();

    this.userSettingsService.$userLocations.subscribe((userLocations) => {
      this.locationList = userLocations;
    });

    if (this.platform.is('capacitor')) {
      App.getInfo().then((info) => {
        this.version = info.version;
      });
    }
  }

  ionViewDidEnter() {
    this.route.fragment.subscribe((qfragment) => {
      if (qfragment === 'notification') this.content.scrollToBottom(500)
    });
  }

  //@ts-ignore
  updateLocation(newLocations: UserLocation[]) {
    this.userSettingsService.updateUserLocationsOrder(newLocations);
  }

  //@ts-ignore
  updateLocationCoordinate(userLocation: UserLocation) {
    this.userSettingsService.updateUserLocationCoordinates(userLocation);
  }

  //@ts-ignore
  removeLocation(location: UserLocation) {
    this.userSettingsService.removeUserLocation(location);
  }

  //@ts-ignore
  addLocation(location: UserLocation | null) {
    if (location !== null) {
      this.userSettingsService.addUserLocation(location);
      this.locationList = this.userSettingsService.getUserSavedLocations();
    }
  }

  openAppInfo() {
    this.navCtrl.navigateForward(['main/app-info']);
    this.menuClosed.emit();
  }

  openLongTermInfo() {
    this.navCtrl.navigateForward(['main/longterm-info']);
    this.menuClosed.emit();
  }

  async toggleTheme() {
    let currentTheme = await this.themeService.getActiveTheme()
    let statusBarColor = ''
    if (currentTheme === this.themeService.CONTRAST_MODE) {
      currentTheme = this.themeService.STANDARD_MODE
      statusBarColor = this.backgroundColor
    } else {
      currentTheme = this.themeService.CONTRAST_MODE
      statusBarColor = contrastModeColor
    }
    // this.statusBar.backgroundColorByHexString(statusBarColor)
    StatusBar.setBackgroundColor({ color: statusBarColor });
    this.themeService.setActiveTheme(currentTheme)
  }
}
