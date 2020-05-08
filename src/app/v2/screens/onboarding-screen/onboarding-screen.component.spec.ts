import {CUSTOM_ELEMENTS_SCHEMA, DebugElement, EventEmitter} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingScreenComponent } from './onboarding-screen.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {LanguageDropdownComponent} from '../../components/language-dropdown/language-dropdown.component';
import {LocationInputComponent} from '../../components/location-input/location-input.component';
import {
  NotificationType,
  UserNotificationSettingsComponent
} from '../../components/user-notification-settings/user-notification-settings.component';
import {UserLocation} from '../../Interfaces';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {GeolocationMock} from '../../testing/geolocation.mock';

describe('OnboardingScreenComponent', () => {
  let component: OnboardingScreenComponent;
  let fixture: ComponentFixture<OnboardingScreenComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OnboardingScreenComponent,
        LanguageDropdownComponent,
        LocationInputComponent,
        UserNotificationSettingsComponent ],
      providers: [
        {provide: Geolocation, useClass: GeolocationMock}
      ],
      imports: [RouterTestingModule, TranslateTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingScreenComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should react on LanguageDropdownComponent event', () => {
    spyOn(component, 'updateUserLanguageSettings');
    const langDropdown = de.query(By.css('app-language-dropdown'));
    const langInstance: LanguageDropdownComponent = langDropdown.componentInstance;
    langInstance.languageChanged.emit('en');
    expect(component.updateUserLanguageSettings).toHaveBeenCalledWith('en');
  });

  it('should react on LocationInputComponent event', () => {
    spyOn(component, 'updateUserLocationSettings');
    const locationInput = de.query(By.css('app-location-input'));
    const locationInstance: LocationInputComponent = locationInput.componentInstance;
    const location: UserLocation = {
      id: 1,
      label: 'Antwerpen',
      type: 'user',
    };
    locationInstance.locationSelected.emit(location);
    expect(component.updateUserLocationSettings).toHaveBeenCalledWith(location);
  });

  it('should react on UserNotificationSettingsComponent event', () => {
    spyOn(component, 'updateUserNotificationSettings');
    const notificationComponent = de.query(By.css('app-user-notification-settings'));
    const notificationInstance: UserNotificationSettingsComponent = notificationComponent.componentInstance;
    const notification = {
      notificationType: NotificationType.exercise,
      enabled: false
    };
    notificationInstance.settingChanged.emit(notification);
    expect(component.updateUserNotificationSettings).toHaveBeenCalledWith(notification);
  });
});
