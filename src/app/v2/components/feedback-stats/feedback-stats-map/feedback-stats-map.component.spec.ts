import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatsMapComponent } from './feedback-stats-map.component';

describe('FeedbackStatsMapComponent', () => {
  let component: FeedbackStatsMapComponent;
  let fixture: ComponentFixture<FeedbackStatsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackStatsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackStatsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
