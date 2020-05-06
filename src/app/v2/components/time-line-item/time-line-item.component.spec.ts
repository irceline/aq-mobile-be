import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BelAirColor} from '../../Interfaces';
import {TimeLineItemComponent, TimeLineItemInput} from './time-line-item.component';

describe('TimeLineItemComponent', () => {
  let component: TimeLineItemComponent;
  let input: TimeLineItemInput;
  let fixture: ComponentFixture<TimeLineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLineItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineItemComponent);
    component = fixture.componentInstance;
    input = {
      color: BelAirColor.Green,
      day: 'Monday',
      status: 'OK',
      selected: true,
    };
    component.data = input;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
