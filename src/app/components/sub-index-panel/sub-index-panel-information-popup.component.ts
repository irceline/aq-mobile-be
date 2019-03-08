import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sub-index-panel-information-popup',
  templateUrl: './sub-index-panel-information-popup.component.html',
  styleUrls: ['./sub-index-panel-information-popup.component.scss'],
})
export class SubIndexPanelInformationPopupComponent {

  constructor(
    private iab: InAppBrowser,
    private translate: TranslateService
  ) { }

  public showMoreInfo() {
    this.iab.create(this.translate.instant('sub-index-panel.information-popup.link'), '_system', 'hidden=yes');
  }

}
