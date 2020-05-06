import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import set = Reflect.set;

export interface UserNotificationSetting {
  notificationType: NotificationType;
  enabled: boolean;
  label?: string;
  icon?: string;
}

// !important, these enum strings are also used on translation files
export enum NotificationType {
  exercise = 'exercise',
  allergies = 'allergies',
  activity = 'activity',
  transport = 'transport',
  highConcentration = 'highConcentration'
}

@Component({
  selector: 'app-user-notification-settings',
  templateUrl: './user-notification-settings.component.html',
  styleUrls: ['./user-notification-settings.component.scss'],
})
export class UserNotificationSettingsComponent implements OnInit {

  private _userSettings: UserNotificationSetting[];

  private _icons = {
    [NotificationType.exercise]: '/assets/images/icons/sport.svg',
    [NotificationType.allergies]: '/assets/images/icons/allergenen.svg',
    [NotificationType.activity]: '/assets/images/icons/inspanning.svg',
    [NotificationType.transport]: '/assets/images/icons/wheel.svg',
    [NotificationType.highConcentration]: '/assets/images/icons/concentraties.svg'
  };

  @Input()
  set userSettings( settings: UserNotificationSetting[]) {
    this._userSettings = settings.map( s => ({
      // get translations
      ...s,
      label: this.translate.instant(`v2.components.user-notification-settings.${s.notificationType}`),
      icon: this._icons[s.notificationType]
    }));
  }

  get userSettings() {
    return this._userSettings;
  }

  @Output() settingChanged = new EventEmitter<UserNotificationSetting>();

  constructor( private translate: TranslateService) { }

  ngOnInit() {}

  changeSetting(setting: UserNotificationSetting) {
    setting.enabled = ! setting.enabled;
    this.settingChanged.emit( setting );
  }

}
