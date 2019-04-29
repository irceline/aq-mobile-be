import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { Platform, IonRouterOutlet, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { PushNotificationsService } from './services/push-notifications/push-notifications.service';
import { InfoOverlayService, DrawerState } from './services/overlay-info-drawer/overlay-info-drawer.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    private pushNotifications: PushNotificationsService,
    private modalCtrl: ModalController,
    private infoOverlay: InfoOverlayService,
  ) {
    this.initializeApp();
    this.backButtonEvent();
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        const modal = await this.modalCtrl.getTop();
        if (modal) {
          modal.dismiss();
        } else if (this.infoOverlay.rawState.value === DrawerState.Open) {
          this.infoOverlay.openClose();
        } else if (this.router.url === '/tabs/start') {
            navigator['app'].exitApp();
        } else {
            window.history.back();
        }
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.show();
      this.splashScreen.hide();
      this.pushNotifications.init();
    });
  }
}
