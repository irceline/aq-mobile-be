import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OnboardingSliderComponent} from './onboarding-slider.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IonSlides} from '@ionic/angular';
import {By} from '@angular/platform-browser';

describe('OnboardingSliderComponent', () => {
    let component: OnboardingSliderComponent;
    let fixture: ComponentFixture<OnboardingSliderComponent>;
    let slidesSpy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OnboardingSliderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, TranslateTestingModule, BrowserAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        slidesSpy = jasmine.createSpyObj('IonSlides', ['isEnd', 'slideNext']);
        fixture = TestBed.createComponent(OnboardingSliderComponent);
        component = fixture.componentInstance;
        component.slides = slidesSpy;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call next on click', () => {
        spyOn(component, 'next');
        const button: HTMLHtmlElement = fixture.debugElement.query(By.css('ion-content > button')).nativeElement;
        button.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(component.next).toHaveBeenCalled();
        });
    });

    it('should change slide on click', () => {
        slidesSpy.isEnd.and.callFake(() => Promise.resolve(false));
        spyOn(component.slideShowComplete, 'emit');
        component.next().then(() => {
            fixture.detectChanges();
            expect(component.slides.slideNext).toHaveBeenCalledTimes(1);
            expect(component.slideShowComplete.emit).toHaveBeenCalledTimes(0);
        });
    });


    it('should complete slide show', () => {
        slidesSpy.isEnd.and.callFake(() => Promise.resolve(true));
        spyOn(component.slideShowComplete, 'emit');
        component.next().then(() => {
            fixture.detectChanges();
            expect(component.slides.slideNext).toHaveBeenCalledTimes(0);
            expect(component.slideShowComplete.emit).toHaveBeenCalledTimes(1);
        });
    });

    it('should have initial button text', () => {
        slidesSpy.isEnd.and.callFake(() => Promise.resolve(false));
        component.slideChanged().then(() => {
            fixture.detectChanges();
            expect(component.btnText).toEqual('v2.components.onboarding-slider.btn-text');
        });
    });

    it('should change button text on last slide', () => {
        slidesSpy.isEnd.and.callFake(() => Promise.resolve(true));
        component.slideChanged().then(() => {
            fixture.detectChanges();
            expect(component.btnText).toEqual('v2.components.onboarding-slider.start-app');
        });
    });
});
