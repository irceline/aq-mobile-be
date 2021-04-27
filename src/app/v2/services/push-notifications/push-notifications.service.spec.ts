import { TestBed } from '@angular/core/testing';

import { PushNotificationsService } from './push-notifications.service';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('PushNotificationsService', () => {
  let service: PushNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Firebase]
    });
    service = TestBed.inject(PushNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
