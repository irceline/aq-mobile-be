import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingScreenComponent } from './rating-screen.component';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService, HttpService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';

xdescribe('RatingScreenComponent', () => {
  let component: RatingScreenComponent;
  let fixture: ComponentFixture<RatingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingScreenComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, CacheModule.forRoot(), TranslateTestingModule, IonicModule],
      providers: [Firebase, Network, SettingsService, HttpService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
