import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingScreenComponent } from './onboarding-screen.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {RouterTestingModule} from '@angular/router/testing';

xdescribe('OnboardingScreenComponent', () => {
  let component: OnboardingScreenComponent;
  let fixture: ComponentFixture<OnboardingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingScreenComponent ],
      imports: [RouterTestingModule, TranslateTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
