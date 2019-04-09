import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramPage } from './diagram.page';

describe('DiagramPage', () => {
  let component: DiagramPage;
  let fixture: ComponentFixture<DiagramPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
