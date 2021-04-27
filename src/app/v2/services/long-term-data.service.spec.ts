import { TestBed } from '@angular/core/testing';

import { LongTermDataService } from './long-term-data.service';
import { TranslateTestingModule } from '../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';

describe('LongTermDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
    providers: [Network, SettingsService]
  }));

  it('should be created', () => {
    const service: LongTermDataService = TestBed.get(LongTermDataService);
    expect(service).toBeTruthy();
  });
});
