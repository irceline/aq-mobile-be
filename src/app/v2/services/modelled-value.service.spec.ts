import { TestBed } from '@angular/core/testing';

import { ModelledValueService } from './modelled-value.service';

describe('ModelledValueService', () => {
  let service: ModelledValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelledValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
