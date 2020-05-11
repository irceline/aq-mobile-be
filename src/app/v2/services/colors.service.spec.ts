import { TestBed } from '@angular/core/testing';

import { ColorsService } from './colors.service';

describe('ColorServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorsService = TestBed.get(ColorsService);
    expect(service).toBeTruthy();
  });
});
