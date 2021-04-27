import { TestBed } from '@angular/core/testing';

import { ForecastDateService } from './forecast-date.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';

describe('ForecastDateService', () => {
  let service: ForecastDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CacheModule.forRoot()],
      providers: [Network, SettingsService]
    });
    service = TestBed.inject(ForecastDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
