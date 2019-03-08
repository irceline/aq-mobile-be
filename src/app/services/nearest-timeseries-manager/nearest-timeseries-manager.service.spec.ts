import { TestBed } from '@angular/core/testing';

import { NearestTimeseriesManagerService } from './nearest-timeseries-manager.service';

describe('NearestTimeseriesManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NearestTimeseriesManagerService = TestBed.get(NearestTimeseriesManagerService);
    expect(service).toBeTruthy();
  });
});
