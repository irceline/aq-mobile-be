import { TestBed } from '@angular/core/testing';

import { GeneralNotificationService } from './general-notification.service';

describe('GeneralNotificationService', () => {
  let service: GeneralNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
