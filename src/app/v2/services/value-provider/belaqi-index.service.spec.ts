import { TestBed } from '@angular/core/testing';

import { BelaqiIndexService } from './belaqi-index.service';

describe('BelaqiIndexService', () => {
  let service: BelaqiIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BelaqiIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
