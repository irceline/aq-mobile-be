import { TestBed } from '@angular/core/testing';

import { BelAQIService } from './bel-aqi.service';

xdescribe('BelAQIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BelAQIService = TestBed.get(BelAQIService);
    expect(service).toBeTruthy();
  });
});
