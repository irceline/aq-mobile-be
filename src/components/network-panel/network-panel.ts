import { Component } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'network-panel',
  templateUrl: 'network-panel.html'
})
export class NetworkPanelComponent {

  public lastupdate: Date;
  public offline: boolean = false;
  public backOnline: boolean = false;

  private networkChange: Subscription;

  constructor(
    private ircelineSettings: IrcelineSettingsProvider,
    private network: Network,
    private platform: Platform
  ) {

    if (this.platform.is('cordova')) {
      this.ircelineSettings.getSettings(false).subscribe(ircelineSettings => {
        this.lastupdate = ircelineSettings.lastupdate;
      });
  
      if (this.network.type === 'none') {
        this.offline = true;
      }
  
      this.networkChange = this.network.onchange().subscribe(() => this.updateNetworkStatus());
    }
  }

  private updateNetworkStatus() {
    if (this.network.type) {
      switch (this.network.type) {
        case 'none':
          this.offline = true;
          break;
        default:
          this.backOnline = true;
          setTimeout(() => {
            this.backOnline = false;
          }, 5000);
          this.offline = false;
          break;
      }
    }
  }

  public ngOnDestroy() {
    if (this.networkChange) {
      this.networkChange.unsubscribe();
    }
  }

}
