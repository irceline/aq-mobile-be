import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSettingsPage } from './modal-settings.page';

describe('ModalSettingsPage', () => {
  let component: ModalSettingsPage;
  let fixture: ComponentFixture<ModalSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
