import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HeaderContent } from '../components/slider-header/slider-header.component';
import { DrawerState } from '../services/overlay-info-drawer/overlay-info-drawer.service';
import { ToastController, Platform } from '@ionic/angular';
import { RefreshHandler } from '../services/refresh/refresh.service';

@Component({
  selector: 'diagram',
  templateUrl: './diagram.page.html',
  styleUrls: ['./diagram.page.scss'],
})
export class DiagramPage {

  public sliderHeader: HeaderContent;

  public dockedHeight = 92;
  public drawerState = DrawerState.Docked;

  constructor(
    public translateSrvc: TranslateService,
    private platform: Platform,
    private toast: ToastController,
    private refreshHandler: RefreshHandler
  ) { }

  public async doRefresh(event) {
    this.refreshHandler.refresh();
    if (this.platform.is('cordova')) {
      const toast = await this.toast.create({ message: this.translateSrvc.instant('refresh-button.message'), duration: 3000 });
      toast.present();
    }
    setTimeout(() => event.target.complete(), 1000);
  }

}
