import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelaqiWheelInformationPage } from './belaqi-wheel-information.page';

describe('BelaqiWheelInformationPage', () => {
  let component: BelaqiWheelInformationPage;
  let fixture: ComponentFixture<BelaqiWheelInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelaqiWheelInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelaqiWheelInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
