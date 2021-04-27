import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CacheModule } from "ionic-cache";

import { FeedbackLocationEditComponent } from './feedback-location-edit.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('FeedbackLocationEditComponent', () => {
  let component: FeedbackLocationEditComponent;
  let fixture: ComponentFixture<FeedbackLocationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackLocationEditComponent ],
      imports: [IonicModule.forRoot(), TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot()],
      providers: [Network, SettingsService, Firebase]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackLocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
