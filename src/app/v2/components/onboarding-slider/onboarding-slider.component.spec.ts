import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroSliderComponent } from './onboarding-slider.component';

describe('IntroSliderComponent', () => {
    let component: IntroSliderComponent;
    let fixture: ComponentFixture<IntroSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntroSliderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntroSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
