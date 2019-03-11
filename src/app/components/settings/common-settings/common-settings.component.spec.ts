import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSettingsPage } from './common-settings.page';

describe('CommonSettingsPage', () => {
  let component: CommonSettingsPage;
  let fixture: ComponentFixture<CommonSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
