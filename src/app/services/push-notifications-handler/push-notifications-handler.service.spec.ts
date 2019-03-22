import { TestBed } from '@angular/core/testing';

import { PushNotificationsHandlerService } from './push-notifications-handler.service';

describe('PushNotificationsHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushNotificationsHandlerService = TestBed.get(PushNotificationsHandlerService);
    expect(service).toBeTruthy();
  });
});
