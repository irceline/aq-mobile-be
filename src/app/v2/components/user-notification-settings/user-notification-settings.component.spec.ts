import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {NotificationType, UserNotificationSetting, UserNotificationSettingsComponent} from './user-notification-settings.component';

describe('NotificationListComponent', () => {
  let component: UserNotificationSettingsComponent;
  let notificationSettingsDefault: UserNotificationSetting[];
  let fixture: ComponentFixture<UserNotificationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationSettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateTestingModule]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change exercise setting', () => {
    fixture = TestBed.createComponent(UserNotificationSettingsComponent);
    component = fixture.componentInstance;

    notificationSettingsDefault = [
      {
        notificationType: NotificationType.exercise,
        enabled: false
      },
      {
        notificationType: NotificationType.allergies,
        enabled: false
      },
      {
        notificationType: NotificationType.activity,
        enabled: false
      },
      {
        notificationType: NotificationType.transport,
        enabled: false
      },
      {
        notificationType: NotificationType.highConcentration,
        enabled: false
      }
    ];

    component.userSettings = notificationSettingsDefault;
    fixture.detectChanges();

    spyOn(component.settingChanged, 'emit');
    const notificationExercise = component.userSettings.find(x => x.notificationType === NotificationType.exercise);

    expect(notificationExercise.enabled).toBe(false);
    expect(component.settingChanged.emit).toHaveBeenCalledTimes(0);

    component.changeSetting(notificationExercise);
    expect(component.settingChanged.emit).toHaveBeenCalledTimes(1);
    expect(component.settingChanged.emit).toHaveBeenCalledWith(notificationExercise);
    expect(notificationExercise.enabled).toBe(true);

    component.changeSetting(notificationExercise);
    expect(component.settingChanged.emit).toHaveBeenCalledTimes(2);
    expect(component.settingChanged.emit).toHaveBeenCalledWith(notificationExercise);
    expect(notificationExercise.enabled).toBe(false);

  });
});
