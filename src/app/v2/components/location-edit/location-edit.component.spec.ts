import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationEditComponent } from './location-edit.component';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('LocationEditComponent', () => {
  let component: LocationEditComponent;
  let fixture: ComponentFixture<LocationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationEditComponent ],
      imports: [IonicModule.forRoot(), TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot()],
      providers: [Network, SettingsService, Firebase]
    }).compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(LocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
