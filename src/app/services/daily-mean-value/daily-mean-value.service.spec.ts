import { TestBed } from '@angular/core/testing';

import { DailyMeanValueService } from './daily-mean-value.service';

describe('DailyMeanValueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyMeanValueService = TestBed.get(DailyMeanValueService);
    expect(service).toBeTruthy();
  });
});
