import { TestBed } from '@angular/core/testing';

import { NotificationPresenterService } from './notification-presenter.service';

describe('NotificationPresenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationPresenterService = TestBed.get(NotificationPresenterService);
    expect(service).toBeTruthy();
  });
});
