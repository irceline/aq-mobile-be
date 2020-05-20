import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationItemComponent } from './information-item.component';

xdescribe('InformationItemComponent', () => {
    let component: InformationItemComponent;
    let fixture: ComponentFixture<InformationItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InformationItemComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
