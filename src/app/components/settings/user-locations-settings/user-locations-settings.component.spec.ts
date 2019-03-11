import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationsSettingsPage } from './user-locations-settings.page';

describe('UserLocationsSettingsPage', () => {
  let component: UserLocationsSettingsPage;
  let fixture: ComponentFixture<UserLocationsSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLocationsSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationsSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
