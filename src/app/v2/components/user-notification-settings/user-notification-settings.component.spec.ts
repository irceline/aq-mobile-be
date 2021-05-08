import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {UserNotificationSettingsComponent} from './user-notification-settings.component';
import {By} from '@angular/platform-browser';
import { localStorageMock } from '../../testing/localStorage.mock';
import { GeneralNotificationService } from '../../services/push-notifications/general-notification.service';
import { UserSettingsService } from './../../services/user-settings.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';

describe('NotificationListComponent', () => {
  let component: UserNotificationSettingsComponent;
  let fixture: ComponentFixture<UserNotificationSettingsComponent>;
  let userSettingsService;

  const initialSettings = JSON.parse(localStorageMock.getItem('belAir.userLocationNotifications'));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationSettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()],
      providers: [FirebaseX]
    })
    .compileComponents();
    userSettingsService = TestBed.get(UserSettingsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct initial setting', () => {
    let bel;
    userSettingsService.$userLocationNotificationsActive.subscribe( ( newIndex ) => {
      bel = newIndex.indexScore;
    });
  });
});
