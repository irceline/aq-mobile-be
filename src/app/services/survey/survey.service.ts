import { EventEmitter, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { IrcelineSettingsService } from '../irceline-settings/irceline-settings.service';

const SURVEY_DESELECT_STORAGE_PARAM = 'SURVEY_DESELECTED';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  public active: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private ircelineSettings: IrcelineSettingsService,
    private storage: Storage
  ) {
    this.checkActivation();
  }

  public checkActivation() {
    this.storage.get(SURVEY_DESELECT_STORAGE_PARAM).then(
      res => {
        if (res) {
          this.active.emit(false);
        } else {
          this.ircelineSettings.getSettings().subscribe(setts => this.active.emit(setts.survey));
        }
      }
    );
  }

  public deactivate() {
    this.storage.set(SURVEY_DESELECT_STORAGE_PARAM, 'true');
    this.active.emit(false);
  }

}
