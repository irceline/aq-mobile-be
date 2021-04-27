import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatsMapComponent } from './feedback-stats-map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateTestingModule } from '../../../testing/TranslateTestingModule';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';

describe('FeedbackStatsMapComponent', () => {
  let component: FeedbackStatsMapComponent;
  let fixture: ComponentFixture<FeedbackStatsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackStatsMapComponent ],
      imports: [HttpClientTestingModule, TranslateTestingModule, CacheModule.forRoot(), IonicModule],
      providers: [Network, SettingsService]
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
