import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundComponent } from './background.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {BelAqiIndexResult, BelAQIService} from '../../services/bel-aqi.service';
import { backgroundImages } from '../../common/constants';

describe('BackgroundComponent', () => {
  let component: BackgroundComponent;
  let fixture: ComponentFixture<BackgroundComponent>;
  let belAQIService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundComponent ],
      imports: [TranslateTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
    belAQIService = TestBed.get(BelAQIService);
    // spyOn(belAQIService.$activeIndex, 'next');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct initial background', () => {
    let bel;
    belAQIService.$activeIndex.subscribe( ( newIndex ) => {
      bel = newIndex.indexScore;
    });
    const de = fixture.debugElement;
    expect(de.styles['background-image']).toContain(backgroundImages[bel]);
  });

  it('should change background after $activeIndex change', () => {
    let someIndex: BelAqiIndexResult;
    belAQIService.$activeIndex.subscribe( ( newIndex ) => {
      someIndex = newIndex;
    });
    someIndex.indexScore = 8;
    belAQIService.$activeIndex.next(someIndex);
    fixture.detectChanges();
    const de = fixture.debugElement;
    expect(de.styles['background-image']).toContain(backgroundImages[8]);
  });
});
