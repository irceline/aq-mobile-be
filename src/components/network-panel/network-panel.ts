import { Component } from '@angular/core';

import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';

@Component({
  selector: 'network-panel',
  templateUrl: 'network-panel.html'
})
export class NetworkPanelComponent {

  public lastupdate: Date;

  constructor(
    private ircelineSettings: IrcelineSettingsProvider,
  ) {
    this.ircelineSettings.getSettings(false).subscribe(ircelineSettings => {
      this.lastupdate = ircelineSettings.lastupdate;
    });
  }

}
