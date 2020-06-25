import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {

  constructor(
    public alertController: AlertController
  ) { }

  init() {

    const logOfConsole = [];

    const _log = console.log,
      _warn = console.warn,
      _error = console.error;

    console.log = (log) => {
      logOfConsole.push({ method: 'log', arguments: log });
      return _log(log);
    };

    console.warn = (warn) => {
      logOfConsole.push({ method: 'warn', arguments: warn });
      return _warn(warn);
    };

    console.error = (error) => {
      logOfConsole.push({ method: 'error', arguments: error });
      const header = error && error.name ? error.name : 'ERROR';
      const message = error && error.message ? error.message : 'ERROR';
      this.presentAlert(header, message);
      return _error(error);
    };

  }

  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
