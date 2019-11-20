import { TestBed } from '@angular/core/testing';

import { UserLocationNotificationsService } from './user-location-notifications.service';

describe('UserLocationNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLocationNotificationsService = TestBed.get(UserLocationNotificationsService);
    expect(service).toBeTruthy();
  });
});
