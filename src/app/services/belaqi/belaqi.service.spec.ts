import { TestBed } from '@angular/core/testing';

import { BelaqiService } from './belaqi.service';

describe('BelaqiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BelaqiService = TestBed.get(BelaqiService);
    expect(service).toBeTruthy();
  });
});
