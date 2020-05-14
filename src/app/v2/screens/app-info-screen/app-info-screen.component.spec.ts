import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInfoScreenComponent } from './app-info-screen.component';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('AppInfoScreenComponent', () => {
    let component: AppInfoScreenComponent;
    let fixture: ComponentFixture<AppInfoScreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppInfoScreenComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppInfoScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
