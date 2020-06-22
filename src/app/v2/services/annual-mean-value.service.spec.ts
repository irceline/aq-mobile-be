import { TestBed } from '@angular/core/testing';

import { AnnualMeanValueService } from './annual-mean-value.service';

describe('AnnualMeanValueService', () => {
  let service: AnnualMeanValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualMeanValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
