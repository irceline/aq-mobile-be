import { TestBed } from '@angular/core/testing';

import { LongTermDataService } from './long-term-data.service';

describe('LongTermDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LongTermDataService = TestBed.get(LongTermDataService);
    expect(service).toBeTruthy();
  });
});
