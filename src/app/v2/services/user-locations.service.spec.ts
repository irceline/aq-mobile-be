import { TestBed } from '@angular/core/testing';

import { UserLocationsService } from './user-locations.service';

describe('UserLocationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLocationsService = TestBed.get(UserLocationsService);
    expect(service).toBeTruthy();
  });
});
