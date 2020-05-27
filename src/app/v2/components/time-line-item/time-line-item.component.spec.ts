import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { localStorageMock } from '../../testing/localStorage.mock';
import {TimeLineItemComponent} from './time-line-item.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {indexLabel, lightIndexColor} from '../../common/constants';

describe('TimeLineItemComponent', () => {
  let component: TimeLineItemComponent;

  let fixture: ComponentFixture<TimeLineItemComponent>;
  const belAqiResults = localStorageMock.getIndexScores(5, 5);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLineItemComponent ],
      imports: [TranslateTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineItemComponent);
    component = fixture.componentInstance;
    component.data = belAqiResults[5];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show proper color and labels', () => {
    const newBelaqiResult = belAqiResults[3];
    component.data = newBelaqiResult;
    fixture.detectChanges();
    expect(component.getColor()).toEqual(lightIndexColor[newBelaqiResult.indexScore]);
    expect(component.getLabel()).toContain(indexLabel[newBelaqiResult.indexScore]);
  });
});
