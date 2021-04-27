import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleChartComponent } from './circle-chart.component';
import { BelAQIService } from '../../services/bel-aqi.service';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import {localStorageMock} from '../../testing/localStorage.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('CircleChartComponent', () => {
  let component: CircleChartComponent;
  let fixture: ComponentFixture<CircleChartComponent>;
  let belAQIService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
      providers: [BelAQIService, Network, SettingsService, Firebase]
    })
    .compileComponents();
    belAQIService = TestBed.get(BelAQIService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(belAQIService, 'getLabelForIndex').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // To get initial data, user need to choose the location first
  // it('should initialize data properly', () => {
  //   let belAqiIndex;
  //   belAQIService.$activeIndex.subscribe( ( newIndex ) => {
  //     belAqiIndex = newIndex.indexScore;
  //   });

  //   console.log(belAqiIndex)
  //   const belAqiText = belAQIService.getLabelForIndex(belAqiIndex);

  //   expect(component.belAqi).toEqual(belAqiIndex);
  //   expect(belAQIService.getLabelForIndex).toHaveBeenCalledWith(belAqiIndex);
  //   expect(component.title).toEqual(belAqiText);
  // });

  it('should update when $activeIndex changes', () => {
    const currentIndexScores = localStorageMock.getIndexScores(5, 5);
    const currentIndex = currentIndexScores[3];
    belAQIService.$activeIndex.next(currentIndex);
    expect(component.belAqi).toEqual(currentIndex.indexScore);

    const belAqiText = belAQIService.getLabelForIndex(currentIndex.indexScore);

    expect(component.belAqi).toEqual(currentIndex.indexScore);
    expect(belAQIService.getLabelForIndex).toHaveBeenCalledWith(currentIndex.indexScore);
    expect(component.title).toEqual(belAqiText);
  });
});
