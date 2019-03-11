import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSettingsPage } from './about-settings.page';

describe('AboutSettingsPage', () => {
  let component: AboutSettingsPage;
  let fixture: ComponentFixture<AboutSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
