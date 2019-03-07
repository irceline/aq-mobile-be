import { TestBed } from '@angular/core/testing';

import { UserLocationListService } from './user-location-list.service';

describe('UserLocationListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLocationListService = TestBed.get(UserLocationListService);
    expect(service).toBeTruthy();
  });
});
