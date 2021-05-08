import { TestBed } from '@angular/core/testing';

import { GeneralNotificationService } from './general-notification.service';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { IonicStorageModule } from '@ionic/storage';

describe('GeneralNotificationService', () => {
  let service: GeneralNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule, IonicStorageModule.forRoot()],
      providers: [FirebaseX]
    });
    service = TestBed.inject(GeneralNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
