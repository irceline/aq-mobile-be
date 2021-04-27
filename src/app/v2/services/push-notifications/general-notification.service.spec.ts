import { TestBed } from '@angular/core/testing';

import { GeneralNotificationService } from './general-notification.service';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { Firebase } from '@ionic-native/firebase/ngx';
import { IonicStorageModule } from '@ionic/storage';

describe('GeneralNotificationService', () => {
  let service: GeneralNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule, IonicStorageModule.forRoot()],
      providers: [Firebase]
    });
    service = TestBed.inject(GeneralNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
