import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { localStorageMock } from '../../testing/localStorage.mock';
import {TimeLineItemComponent} from './time-line-item.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {indexLabel, lightIndexColor} from '../../common/constants';
import {By} from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { specHelper } from '../../testing/spec-helper';

describe('TimeLineItemComponent', () => {
  let component: TimeLineItemComponent;

  let fixture: ComponentFixture<TimeLineItemComponent>;
  const belAqiResults = localStorageMock.getIndexScores(5, 5);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLineItemComponent ],
      imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [Network, SettingsService, Firebase]
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

  it('should fetch proper color and labels', () => {
    const newBelaqiResult = belAqiResults[3];
    component.data = newBelaqiResult;
    fixture.detectChanges();
    expect(component.getColor()).toEqual(lightIndexColor[newBelaqiResult.indexScore]);
    expect(component.getLabel()).toContain(indexLabel[newBelaqiResult.indexScore]);
  });

  it('should render proper color and labels', () => {
    const newBelaqiResult = belAqiResults[7];
    component.data = newBelaqiResult;
    fixture.detectChanges();
    const de = fixture.debugElement;
    const header = de.query(By.css('.timeline--item-header'));
    const status = de.query(By.css('.timeline--item-status')).nativeElement;
    expect(specHelper.rgb2hex(header.styles['background-color'])).toEqual(lightIndexColor[newBelaqiResult.indexScore].toLowerCase());
    expect(status.innerHTML).toContain(indexLabel[newBelaqiResult.indexScore]);
  });
});
