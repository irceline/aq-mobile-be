import { TestBed } from '@angular/core/testing';

import { ForecastDateService } from './forecast-date.service';

describe('ForecastDateService', () => {
  let service: ForecastDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForecastDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
