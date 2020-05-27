import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineListComponent } from './time-line-list.component';
import { IonSlides } from '@ionic/angular';
import { localStorageMock } from '../../testing/localStorage.mock';
import {TimeLineItemComponent} from '../time-line-item/time-line-item.component';
import {By} from '@angular/platform-browser';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {indexLabel, lightIndexColor} from '../../common/constants';

describe('TimeLineListComponent', () => {
  let component: TimeLineListComponent;
  let fixture: ComponentFixture<TimeLineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          TimeLineListComponent,
          TimeLineItemComponent,
          IonSlides],
      imports: [TranslateTestingModule],
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

  it('should render all items properly', () => {
    const de = fixture.debugElement;
    const timeLineItems = de.queryAll(By.css('app-time-line-item'));
    expect(timeLineItems.length).toBeGreaterThan(0);
    expect(timeLineItems.length).toEqual(component.items.length);
    timeLineItems.map((item, index) => {
      const timeLineItem: TimeLineItemComponent = item.componentInstance;
      expect(timeLineItem.getColor()).toEqual(lightIndexColor[component.items[index].indexScore]);
      expect(timeLineItem.getLabel()).toContain(indexLabel[component.items[index].indexScore]);

      const header = item.query(By.css('.timeline--item-header'));
      const status = item.query(By.css('.timeline--item-status')).nativeElement;
      expect(header.styles['background-color']).toEqual(lightIndexColor[component.items[index].indexScore]);
      expect(status.innerHTML).toContain(indexLabel[component.items[index].indexScore]);
    });
  });
});
