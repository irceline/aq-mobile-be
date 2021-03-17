import { TestBed } from '@angular/core/testing';

import { AutomatedNotificationService } from './automated-notification.service';

describe('AutomatedNotificationService', () => {
  let service: AutomatedNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomatedNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
