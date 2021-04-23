import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSwipeComponent } from './location-swipe.component';
import { IonSlides } from '@ionic/angular';
import { localStorageMock } from '../../testing/localStorage.mock';

fdescribe('LocationSwipeComponent', () => {
  let component: LocationSwipeComponent;
  let fixture: ComponentFixture<LocationSwipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          LocationSwipeComponent,
          IonSlides
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSwipeComponent);
    component = fixture.componentInstance;
    component.slides = TestBed.createComponent(IonSlides).componentInstance;
    component.locations = JSON.parse(localStorageMock.getItem('belAir.userLocations'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit proper events on slide change', () => {
    spyOn(component.slides, 'getActiveIndex').and.callFake(() => Promise.resolve(2));
    spyOn(component.locationChange, 'next');
    component.slideChange().then(() => {
      expect(component.slides.getActiveIndex).toHaveBeenCalled();
      expect(component.locationChange.next).toHaveBeenCalledWith(component.locations[2]);
    });
  });
});
