import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntroPage } from './modal-intro.page';

describe('ModalIntroPage', () => {
  let component: ModalIntroPage;
  let fixture: ComponentFixture<ModalIntroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIntroPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
