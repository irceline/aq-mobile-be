import { TestBed } from '@angular/core/testing';

import { MapDataService } from './map-data.service';

describe('MapDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapDataService = TestBed.get(MapDataService);
    expect(service).toBeTruthy();
  });
});
