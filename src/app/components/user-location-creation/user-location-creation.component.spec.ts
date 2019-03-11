import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationCreationPage } from './user-location-creation.page';

describe('UserLocationCreationPage', () => {
  let component: UserLocationCreationPage;
  let fixture: ComponentFixture<UserLocationCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLocationCreationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
