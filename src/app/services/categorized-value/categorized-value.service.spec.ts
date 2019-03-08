import { TestBed } from '@angular/core/testing';

import { CategorizedValueService } from './categorized-value.service';

describe('CategorizedValueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategorizedValueService = TestBed.get(CategorizedValueService);
    expect(service).toBeTruthy();
  });
});
