import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BelaqiChartPage } from './belaqi-chart.page';

describe('BelaqiChartPage', () => {
  let component: BelaqiChartPage;
  let fixture: ComponentFixture<BelaqiChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BelaqiChartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BelaqiChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
