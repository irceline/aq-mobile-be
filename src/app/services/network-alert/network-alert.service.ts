import { EventEmitter, Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { LanguageHandlerService } from '../language-handler/language-handler.service';

@Injectable({ providedIn: 'root' })
export class NetworkAlertService {

  private alert: HTMLIonAlertElement;
  private showAlert: boolean;

  public onConnected: EventEmitter<void> = new EventEmitter();

  constructor(
    private network: Network,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private languageHandler: LanguageHandlerService
  ) {
    this.network.onDisconnect().subscribe(() => this.disconnected());
    this.network.onConnect().subscribe(() => this.connected());

    if (this.network.type === 'none') {
      this.disconnected();
    }
  }

  private connected(): void {
    if (this.showAlert) {
      this.showAlert = false;
      this.alert.dismiss();
      this.onConnected.emit();
    }
  }

  private disconnected(): void {
    if (!this.showAlert) {
      this.showAlert = true;
      this.languageHandler.waitForTranslation().subscribe(() => this.showAlertDialog());
    }
  }

  private showAlertDialog() {
    this.translate.get('no-network-connection.header').subscribe(res => {
      this.alertCtrl.create({
        header: this.translate.instant('no-network-connection.header'),
        message: this.translate.instant('no-network-connection.body'),
        backdropDismiss: false,
        buttons: [this.translate.instant('no-network-connection.close')]
      }).then(alert => {
        this.alert = alert;
        this.alert.present();
      });
    });
  }
}
