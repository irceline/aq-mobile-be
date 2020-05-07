import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleChartComponent } from './circle-chart.component';

xdescribe('CircleChartComponent', () => {
  let component: CircleChartComponent;
  let fixture: ComponentFixture<CircleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
