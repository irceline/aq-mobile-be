import { TestBed } from '@angular/core/testing';

import { OngoingHttpCacheService } from './ongoing-http-cache.service';

describe('OngoingHttpCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OngoingHttpCacheService = TestBed.get(OngoingHttpCacheService);
    expect(service).toBeTruthy();
  });
});
