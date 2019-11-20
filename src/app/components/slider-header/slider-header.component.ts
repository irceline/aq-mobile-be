import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { ModalSettingsComponent } from '../settings/modal-settings/modal-settings.component';
import { Network } from '@ionic-native/network/ngx';
import { Subscription } from 'rxjs';

export interface HeaderContent {
  label: string;
  date: Date;
  current: boolean;
}

@Component({
  selector: 'slider-header',
  templateUrl: './slider-header.component.html',
  styleUrls: ['./slider-header.component.scss'],
})
export class SliderHeaderComponent implements OnInit, OnChanges {

  @Input()
  public header: HeaderContent;

  public oldDataWarning: boolean;
  public offlineModeWarning: boolean;

  private networkSubscriptionOnline: Subscription;
  private networkSubscriptionOffline: Subscription;

  constructor(
    public translateSrvc: TranslateService,
    private modalCtrl: ModalController,
    private network: Network
  ) {}

  ngOnInit() {
    this.networkSubscriptionOnline = this.network.onConnect().subscribe(() => {
      this.offlineModeWarning = false;
    })
    this.networkSubscriptionOffline = this.network.onDisconnect().subscribe(() => {
      this.offlineModeWarning = true;
    })
    if (this.network.type === 'none') {
      this.offlineModeWarning = true;
    }
  }

  public ngOnDestroy() {
    this.networkSubscriptionOffline.unsubscribe();
    this.networkSubscriptionOnline.unsubscribe();
  }

  public setHeaderContent(headerContent: HeaderContent) {
    let visibility;
    if (headerContent) {
      visibility = 'inherit';
    } else {
      visibility = 'hidden';
    }
    const locationHeaderElems = document.querySelectorAll('.location-header');
    for (let i = 0; i < locationHeaderElems.length; i++) {
      (locationHeaderElems[i] as HTMLElement).style.visibility = visibility;
    }
  }

  ngOnChanges() {
    if (this.header && this.header.date) {
      // Show Warning if Data is older than 2.5h aka 9000000ms
      if ((new Date().getTime() - this.header.date.getTime()) > 9000000) {
        this.oldDataWarning = true;
      } else {
        this.oldDataWarning = false;
      }
    }
  }

  public navigateSettings() {
    this.modalCtrl.create({ component: ModalSettingsComponent }).then(modal => modal.present());
  }

}
