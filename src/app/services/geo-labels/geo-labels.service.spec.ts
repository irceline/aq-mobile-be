import { TestBed } from '@angular/core/testing';

import { GeoLabelsService } from './geo-labels.service';

describe('GeoLabelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoLabelsService = TestBed.get(GeoLabelsService);
    expect(service).toBeTruthy();
  });
});
