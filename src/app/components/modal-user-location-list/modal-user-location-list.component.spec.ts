import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserLocationListPage } from './modal-user-location-list.page';

describe('ModalUserLocationListPage', () => {
  let component: ModalUserLocationListPage;
  let fixture: ComponentFixture<ModalUserLocationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserLocationListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserLocationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
