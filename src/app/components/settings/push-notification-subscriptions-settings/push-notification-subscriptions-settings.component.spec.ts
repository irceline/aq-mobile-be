import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNotificationSubscriptionsSettingsPage } from './push-notification-subscriptions-settings.page';

describe('PushNotificationSubscriptionsSettingsPage', () => {
  let component: PushNotificationSubscriptionsSettingsPage;
  let fixture: ComponentFixture<PushNotificationSubscriptionsSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushNotificationSubscriptionsSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushNotificationSubscriptionsSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
