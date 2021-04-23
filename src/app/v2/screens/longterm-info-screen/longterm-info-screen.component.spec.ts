import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongtermInfoScreenComponent } from './longterm-info-screen.component';

describe('LongtermInfoScreenComponent', () => {
    let component: LongtermInfoScreenComponent;
    let fixture: ComponentFixture<LongtermInfoScreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LongtermInfoScreenComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LongtermInfoScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
