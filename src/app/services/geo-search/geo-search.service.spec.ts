import { TestBed } from '@angular/core/testing';

import { GeoSearchService } from './geo-search.service';

describe('GeoSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoSearchService = TestBed.get(GeoSearchService);
    expect(service).toBeTruthy();
  });
});
