import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoButtonComponent } from './info-button.component';

xdescribe('InfoButtonComponent', () => {
    let component: InfoButtonComponent;
    let fixture: ComponentFixture<InfoButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InfoButtonComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
