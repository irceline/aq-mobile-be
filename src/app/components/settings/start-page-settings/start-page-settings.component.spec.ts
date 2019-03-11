import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPageSettingsPage } from './start-page-settings.page';

describe('StartPageSettingsPage', () => {
  let component: StartPageSettingsPage;
  let fixture: ComponentFixture<StartPageSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartPageSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPageSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
