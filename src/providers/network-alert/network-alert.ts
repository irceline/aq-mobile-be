import { EventEmitter, Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';
import { Alert, AlertController } from 'ionic-angular';

import { LanguageHandlerProvider } from '../language-handler/language-handler';

@Injectable({ providedIn: 'root' })
export class NetworkAlertProvider {

  private alert: Alert;
  private showAlert: boolean;

  public onConnected: EventEmitter<void> = new EventEmitter();

  constructor(
    private network: Network,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private languageHandler: LanguageHandlerProvider
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
    this.alert = this.alertCtrl.create({
      title: this.translate.instant('no-network-connection.header'),
      message: this.translate.instant('no-network-connection.body'),
      enableBackdropDismiss: false,
      buttons: ['no-network-connection.close']
    });
    this.alert.present();
  }
}
