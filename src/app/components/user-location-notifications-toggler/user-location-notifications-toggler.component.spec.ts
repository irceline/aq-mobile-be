import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationNotificationsTogglerComponent } from './user-location-notifications-toggler.component';

describe('UserLocationNotificationsTogglerComponent', () => {
  let component: UserLocationNotificationsTogglerComponent;
  let fixture: ComponentFixture<UserLocationNotificationsTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLocationNotificationsTogglerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationNotificationsTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
