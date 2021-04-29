import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BackgroundComponent } from './background.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {BelAqiIndexResult, BelAQIService} from '../../services/bel-aqi.service';
import { backgroundImages } from '../../common/constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {localStorageMock} from '../../testing/localStorage.mock';

describe('BackgroundComponent', () => {
  let component: BackgroundComponent;
  let fixture: ComponentFixture<BackgroundComponent>;
  let belAQIService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundComponent ],
      imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ BelAQIService, Network, SettingsService, FirebaseX, StatusBar ],
    })
    .compileComponents();
    belAQIService = TestBed.get(BelAQIService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(belAQIService, 'getBackgroundForIndex').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // To get initial data, user need to choose the location first
  // it('should show correct initial background', () => {
  //   let bel;
  //   belAQIService.$activeIndex.subscribe( ( newIndex ) => {
  //     bel = newIndex.indexScore;
  //   });
  //   const de = fixture.debugElement;
  //   expect(de.styles['background-image']).toContain(backgroundImages[bel]);
  // });

  it('should update background after $activeIndex change', async () => {
    const currentIndexScores = localStorageMock.getIndexScores(5, 5);
    const currentIndex = currentIndexScores[3];
    belAQIService.$activeIndex.next(currentIndex);

    const belAqiBackground = belAQIService.getBackgroundForIndex(currentIndex.indexScore);

    expect(belAQIService.getBackgroundForIndex).toHaveBeenCalledWith(currentIndex.indexScore);
    expect(component.background).toEqual(belAqiBackground);
  });
});
