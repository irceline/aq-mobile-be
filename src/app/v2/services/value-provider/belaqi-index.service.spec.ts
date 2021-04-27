import { TestBed } from '@angular/core/testing';

import { BelaqiIndexService } from './belaqi-index.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';

describe('BelaqiIndexService', () => {
  let service: BelaqiIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
      providers: [Network, SettingsService]
    });
    service = TestBed.inject(BelaqiIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
