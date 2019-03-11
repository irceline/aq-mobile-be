import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserLocationCreationPage } from './modal-user-location-creation.page';

describe('ModalUserLocationCreationPage', () => {
  let component: ModalUserLocationCreationPage;
  let fixture: ComponentFixture<ModalUserLocationCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserLocationCreationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserLocationCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
