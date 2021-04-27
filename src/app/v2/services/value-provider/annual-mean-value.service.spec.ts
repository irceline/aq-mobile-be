import { TestBed } from '@angular/core/testing';

import { AnnualMeanValueService } from './annual-mean-value.service';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SettingsService } from '@helgoland/core';
import { CacheModule } from "ionic-cache";
import { IonicModule } from '@ionic/angular';

describe('AnnualMeanValueService', () => {
  let service: AnnualMeanValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
      providers: [SettingsService]
    });
    service = TestBed.inject(AnnualMeanValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
