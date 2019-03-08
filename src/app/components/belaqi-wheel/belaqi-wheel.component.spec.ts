import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelaqiWheelPage } from './belaqi-wheel.page';

describe('BelaqiWheelPage', () => {
  let component: BelaqiWheelPage;
  let fixture: ComponentFixture<BelaqiWheelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelaqiWheelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelaqiWheelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
