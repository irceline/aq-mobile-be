import { TestBed } from '@angular/core/testing';

import { LocateService } from './locate.service';

describe('LocateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocateService = TestBed.get(LocateService);
    expect(service).toBeTruthy();
  });
});
