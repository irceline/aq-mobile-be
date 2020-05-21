import { TestBed } from '@angular/core/testing';

import { LongTermDataService } from './long-term-data.service';

xdescribe('LongTermDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LongTermDataService = TestBed.get(LongTermDataService);
    expect(service).toBeTruthy();
  });
});
