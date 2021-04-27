import { TestBed } from '@angular/core/testing';

import { GeocoderService } from './geocoder.service';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";

describe('GeocoderService', () => {
  let service: GeocoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CacheModule.forRoot(), TranslateTestingModule]
    });
    service = TestBed.inject(GeocoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
