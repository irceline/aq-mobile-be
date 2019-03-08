import { TestBed } from '@angular/core/testing';

import { AnnualMeanService } from './annual-mean.service';

describe('AnnualMeanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnualMeanService = TestBed.get(AnnualMeanService);
    expect(service).toBeTruthy();
  });
});
