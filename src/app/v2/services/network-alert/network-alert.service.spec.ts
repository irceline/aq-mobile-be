import { TestBed } from '@angular/core/testing';

import { NetworkAlertService } from './network-alert.service';

describe('NetworkAlertService', () => {
  let service: NetworkAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
