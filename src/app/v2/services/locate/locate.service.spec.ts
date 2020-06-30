import { TestBed } from '@angular/core/testing';

import { LocateService } from './locate.service';

describe('LocateService', () => {
  let service: LocateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
