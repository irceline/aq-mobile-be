import { TestBed } from '@angular/core/testing';

import { NetworkAlertService } from './network-alert.service';

describe('NetworkAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkAlertService = TestBed.get(NetworkAlertService);
    expect(service).toBeTruthy();
  });
});
