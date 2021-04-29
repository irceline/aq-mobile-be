import { TestBed } from '@angular/core/testing';

import { PushNotificationsService } from './push-notifications.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

describe('PushNotificationsService', () => {
  let service: PushNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseX]
    });
    service = TestBed.inject(PushNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
