import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// import { IonSlides } from '@ionic/angular'; // not used ??
import { Subscription } from 'rxjs';
import { indexLabel } from '../../common/constants';

import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { UserSettingsService } from './../../services/user-settings.service';

@Component({
  selector: 'app-user-notification-settings',
  templateUrl: './user-notification-settings.component.html',
  styleUrls: ['./user-notification-settings.component.scss', './user-notification-settings.component.hc.scss'],
})
export class UserNotificationSettingsComponent implements OnInit, OnDestroy {
  // @ViewChild(IonSlides) slides: IonSlides; // not used ??

  @Output() getFocus = new EventEmitter<boolean>();
  @Output() loseFocus = new EventEmitter<boolean>();

  @Output() lockSwipes = new EventEmitter<boolean>();

  public generalNotification!: boolean;
  public userLocationNotifications!: boolean;
  public aqiScoreNotifications!: number;
  public aqiScoreColor!: string;
  public aqiIndexName!: string;

  aqiThresholdDelayTimer?: any

  private stateSubs: Subscription[] = [];

  constructor(
    private generalNotificationSrvc: GeneralNotificationService,
    private userSettingsSrvc: UserSettingsService
  ) { }

  ngOnInit() {
    // LIVE subscriptions, not .pipe(first()) one-shot snapshots: a snapshot
    // left the toggle stale (showing OFF) whenever the screen was opened
    // while a subscribe/unsubscribe batch was still running, after a session
    // killed before the state was persisted, or when this component was kept
    // alive on the Ionic nav stack. Keeping the subscription open keeps the
    // toggle in sync with the real notification state.
    this.stateSubs.push(
      this.generalNotificationSrvc.$active.subscribe(res => this.generalNotification = res)
    );
    this.stateSubs.push(
      this.userSettingsSrvc.$userLocationNotificationsActive.subscribe(res => this.userLocationNotifications = res)
    );
    // // @todo: get aqi score notif
    this.stateSubs.push(
      this.userSettingsSrvc.$userAqiIndexThreshold.subscribe(res => {
        this.aqiScoreNotifications = res;
        this.aqiScoreColor = `aqi${this.aqiScoreNotifications}`
        this.aqiIndexName = indexLabel[this.aqiScoreNotifications]
      })
    );
  }

  ngOnDestroy() {
    // aqi threshold uses the same BehaviorSubject pattern the toggle states
    // did before; unsubscribing here prevents leaked subscriptions when the
    // component is destroyed (Ionic nav stack can keep components alive, so
    // make teardown explicit).
    this.stateSubs.forEach(s => s.unsubscribe());
    this.stateSubs = [];
  }

  async generalNotifToggleChange(event) {
    if (this.generalNotification === event.detail.checked) return
    console.log('general notif toggle changed from', this.generalNotification, 'to', event.detail.checked)
    this.generalNotification = event.detail.checked
    // subscribe
    if (event.detail.checked) {
      this.generalNotificationSrvc.subscribeNotification(true).subscribe(subscribed => {
        setTimeout(() => {
          this.generalNotification = subscribed ? true : false
        }, 250)
      })
    }
    // unsubs
    else {
      if (this.userLocationNotifications) this.userLocationNotifToggleChange(event);
      this.generalNotificationSrvc.unsubscribeNotification(true).subscribe(unsubscribed => {
        setTimeout(() => {
          this.generalNotification = unsubscribed ? false : true
        }, 250)
      })
    }
  }

  async userLocationNotifToggleChange(event:any) {
    if (this.userLocationNotifications === event.detail.checked) return
    console.log('user loc toggle changed from', this.userLocationNotifications, 'to', event.detail.checked)
    await this.userSettingsSrvc.showLoading()
    // subscribe
    if (event.detail.checked) {
        this.userSettingsSrvc.subscribeNotification().subscribe(subscribed => {
            const toggle = subscribed ? true : false
            if (toggle && !this.generalNotification) this.generalNotifToggleChange(event)
            setTimeout(() => {
                this.userLocationNotifications = toggle
                this.userSettingsSrvc.dismissLoading()
            }, 250)
        }, () => {
            // error path was previously missing: any subscribe failure left
            // the loading spinner up forever
            this.userSettingsSrvc.dismissLoading()
        })
    }
    // unsubs
    else {
        this.userSettingsSrvc.unsubscribeNotification().subscribe(unsubscribed => {
            // unsubscribed always returning false even requests are success(?)
            // console.log(unsubscribed, 'this always false')
            setTimeout(() => {
                this.userLocationNotifications = false
                this.userSettingsSrvc.dismissLoading()
            }, 250)
        }, () => {
            this.userSettingsSrvc.dismissLoading()
        })
    }
  }

  hasFocus() {
    this.getFocus.next(true);
  }

  blurFocus() {
    this.loseFocus.next(false);
  }

  changeThresholdEnd(event:any) {
    this.blurFocus()
    // Update user AQI threshold to storage
    this.userSettingsSrvc.setUserAQIIndexThreshold(event.target.value)
    const locations = this.userSettingsSrvc.getUserSavedLocations()
    this.userSettingsSrvc.updateUserLocationsOrder(locations.map(location => ({
        ...location,
        indexThreshold: event.target.value
    })))
    // revert userLocationNotifications to false first so we can re-trigger userLocationNotifToggleChange
    this.userLocationNotifications = false
    this.userLocationNotifToggleChange({ detail: { checked: true } })
  }

  changeThreshold(event:any) {
    this.aqiScoreNotifications = event.target.value
    this.aqiScoreColor = `aqi${event.target.value}`
    this.aqiIndexName = indexLabel[event.target.value]

    // THIS ONE ALREADY COMMENTED BEFORE
    // // Update user AQI threshold to storage
    // if (this.aqiThresholdDelayTimer) clearTimeout(this.aqiThresholdDelayTimer)

    // this.aqiThresholdDelayTimer = setTimeout(() => {
    // const locations = this.userSettingsSrvc.getUserSavedLocations()

    // this.userSettingsSrvc.updateUserLocationsOrder(locations.map(location => ({
    //     ...location,
    //     indexThreshold: event.target.value
    // })))

    //     if (this.userLocationNotifications) {
    //         // resubscribe to update the index AQI threshold
    //         this.userSettingsSrvc.subscribeNotification().subscribe();
    //     }
    // }, 500)
  }
}
