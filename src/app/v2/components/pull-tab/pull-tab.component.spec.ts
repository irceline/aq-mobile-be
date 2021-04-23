import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PullTabComponent } from './pull-tab.component';

describe('PullTabComponent', () => {
  let component: PullTabComponent;
  let fixture: ComponentFixture<PullTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PullTabComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PullTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
