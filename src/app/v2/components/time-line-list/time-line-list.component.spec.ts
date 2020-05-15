import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineListComponent } from './time-line-list.component';
import { IonSlides } from '@ionic/angular';
import { localStorageMock } from '../../testing/localStorage.mock';

fdescribe('TimeLineListComponent', () => {
  let component: TimeLineListComponent;
  let fixture: ComponentFixture<TimeLineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          TimeLineListComponent,
          IonSlides],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineListComponent);
    component = fixture.componentInstance;
    component.slides = TestBed.createComponent(IonSlides).componentInstance;
    component.items = localStorageMock.getIndexScores(5, 5);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit proper events on slide change', () => {
    spyOn(component.slides, 'getActiveIndex').and.callFake(() => Promise.resolve(2));
    spyOn(component.dayChange, 'next');
    component.slideChange().then(() => {
      expect(component.slides.getActiveIndex).toHaveBeenCalled();
      expect(component.dayChange.next).toHaveBeenCalled();
    });
  });
});
