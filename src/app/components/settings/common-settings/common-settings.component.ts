import { Component } from '@angular/core';
import { LocalSelectorComponent } from '@helgoland/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'common-settings',
  templateUrl: './common-settings.component.html',
  styleUrls: ['./common-settings.component.scss'],
})
export class CommonSettingsComponent extends LocalSelectorComponent {

  public clearingCache: boolean;

  constructor(
    public translate: TranslateService,
    private cacheService: CacheService,
    private toast: ToastController
  ) {
    super(translate);
  }

  public clearCache() {
    this.clearingCache = true;
    this.cacheService.clearAll()
      .then(() => {
        this.toast
          .create({ message: this.translate.instant('settings.clear-cache.confirm'), duration: 3000 })
          .then(toast => toast.present());
        this.clearingCache = false;
      })
      .catch(error => {
        this.toast
          .create({ message: JSON.stringify(error), duration: 3000 })
          .then(toast => toast.present());
        this.clearingCache = false;
      });
  }

}
