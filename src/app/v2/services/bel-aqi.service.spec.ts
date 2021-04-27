import { TestBed } from '@angular/core/testing';

import { BelAQIService } from './bel-aqi.service';
import {TranslateTestingModule} from '../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';

describe('BelAQIService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
    providers: [Network, SettingsService]
  }));

  it('should be created', () => {
    const service: BelAQIService = TestBed.get(BelAQIService);
    expect(service).toBeTruthy();
  });
});
