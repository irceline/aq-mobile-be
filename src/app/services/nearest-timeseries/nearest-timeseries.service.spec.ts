import { TestBed } from '@angular/core/testing';

import { NearestTimeseriesService } from './nearest-timeseries.service';

describe('NearestTimeseriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NearestTimeseriesService = TestBed.get(NearestTimeseriesService);
    expect(service).toBeTruthy();
  });
});
