import { TestBed } from '@angular/core/testing';

import { NotificationMaintainerService } from './notification-maintainer.service';

describe('NotificationMaintainerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationMaintainerService = TestBed.get(NotificationMaintainerService);
    expect(service).toBeTruthy();
  });
});
