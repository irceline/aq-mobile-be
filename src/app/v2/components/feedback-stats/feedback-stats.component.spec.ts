import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CacheModule } from "ionic-cache";

import { FeedbackStatsComponent } from './feedback-stats.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Network } from '@ionic-native/network/ngx';
import { SettingsService, HttpService } from '@helgoland/core';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('FeedbackStatsComponent', () => {
  let component: FeedbackStatsComponent;
  let fixture: ComponentFixture<FeedbackStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackStatsComponent ],
      imports: [IonicModule.forRoot(), TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot()],
      providers: [Network, SettingsService, Firebase, HttpService]
    }).compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
