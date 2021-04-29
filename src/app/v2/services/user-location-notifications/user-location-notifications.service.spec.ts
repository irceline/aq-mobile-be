import { TestBed } from '@angular/core/testing';

import { UserLocationNotificationsService } from './user-location-notifications.service';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

describe('UserLocationNotificationsService', () => {
  let service: UserLocationNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateTestingModule],
      providers: [FirebaseX]
    });
    service = TestBed.inject(UserLocationNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
