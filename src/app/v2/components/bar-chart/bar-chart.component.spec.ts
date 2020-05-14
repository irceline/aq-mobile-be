import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';

xdescribe('BarChartComponent', () => {
    let component: BarChartComponent;
    let fixture: ComponentFixture<BarChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BarChartComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
