import { TestBed } from '@angular/core/testing';

import { ModelledValueService } from './modelled-value.service';

describe('ModelledValueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelledValueService = TestBed.get(ModelledValueService);
    expect(service).toBeTruthy();
  });
});
