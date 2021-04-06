import { TestBed } from '@angular/core/testing';

import { UserLocationNotificationsService } from './user-location-notifications.service';

describe('UserLocationNotificationsService', () => {
  let service: UserLocationNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLocationNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
