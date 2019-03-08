import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelaqiChartInformationPage } from './belaqi-chart-information.page';

describe('BelaqiChartInformationPage', () => {
  let component: BelaqiChartInformationPage;
  let fixture: ComponentFixture<BelaqiChartInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelaqiChartInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelaqiChartInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
