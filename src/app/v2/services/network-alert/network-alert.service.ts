import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ReplaySubject } from 'rxjs';

import { ErrorModalService, ErrorType } from './../../components/error-modal/error-modal.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkAlertService {

  public isConnected: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private network: Network,
    private errorModalSrvc: ErrorModalService
  ) {
    this.network.onDisconnect().subscribe(() => this.disconnected());
    this.network.onConnect().subscribe(() => this.connected());

    // if (this.network.type === 'none') {
    //   console.log(`this.network.type`);
    //   this.disconnected();
    // }
  }

  private connected(): void {
    this.isConnected.next(true);
  }

  private disconnected(): void {
    this.isConnected.next(false);
    this.errorModalSrvc.openErrorModal(ErrorType.NO_NETWORK);
  }

}
