import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {NotificationType, UserNotificationSettingsComponent} from './user-notification-settings.component';
import {By} from '@angular/platform-browser';
import { localStorageMock } from '../../testing/localStorage.mock';

describe('NotificationListComponent', () => {
  let component: UserNotificationSettingsComponent;
  let fixture: ComponentFixture<UserNotificationSettingsComponent>;

  const initialSettings = JSON.parse(localStorageMock.getItem('belAir.userNotificationSettings'));
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

    component.userSettings = initialSettings;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial settings in given order', () => {
    const element: HTMLElement = fixture.nativeElement;
    const labels = element.querySelectorAll('ion-label');
    for (let i = 0 ; i < 5; i++) {
      expect(labels[i].innerText).toContain(initialSettings[i].notificationType);
    }
  });

  it('should render initial settings false', () => {
    const element = fixture.debugElement;
    const toggles = element.queryAll(By.css('ion-toggle'));
    const checkedToggles = toggles.filter(toggle => toggle.properties.checked);
    expect(checkedToggles.length).toEqual(0);
  });

  it('should render specific initial settings true', () => {
    fixture = TestBed.createComponent(UserNotificationSettingsComponent);
    component = fixture.componentInstance;

    const allergiesSetting = {
      notificationType: NotificationType.allergies,
      enabled: true
    };
    const newSettings = initialSettings;
    newSettings[1] = allergiesSetting;
    component.userSettings = newSettings;
    fixture.detectChanges();

    const element = fixture.debugElement;
    const toggles = element.queryAll(By.css('ion-toggle'));
    const allergiesToggle = toggles[1];
    expect(allergiesToggle.properties.checked).toEqual(true);
  });

  it('should change a given setting and emit event with correct data', () => {
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

  it('should update settings UI after user interaction', () => {
    const notificationExercise = component.userSettings.find(x => x.notificationType === NotificationType.exercise);
    component.changeSetting(notificationExercise);
    fixture.detectChanges();
    const element = fixture.debugElement;
    const toggles = element.queryAll(By.css('ion-toggle'));

    const exerciseToggle = toggles[4];
    expect(exerciseToggle.properties.checked).toEqual(true);

    const notificationActivity = component.userSettings.find(x => x.notificationType === NotificationType.activity);
    component.changeSetting(notificationActivity);
    fixture.detectChanges();

    const activityToggle = toggles[2];
    expect(activityToggle.properties.checked).toEqual(true);
  });
});
