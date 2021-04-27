import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoButtonComponent } from './info-button.component';
import {NavController} from '@ionic/angular';
import {NavControllerMock} from '../../testing/nav-controller.mock';

describe('InfoButtonComponent', () => {
    let component: InfoButtonComponent;
    let fixture: ComponentFixture<InfoButtonComponent>;
    let navController: NavController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InfoButtonComponent],
            providers: [
                {provide: NavController, useClass: NavControllerMock}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoButtonComponent);
        navController = TestBed.get(NavController);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to AppInfo', () => {
        spyOn(navController, 'navigateForward');
        component.goTo();
        expect(navController.navigateForward).toHaveBeenCalledWith(['/main/app-info']);
    });
});
