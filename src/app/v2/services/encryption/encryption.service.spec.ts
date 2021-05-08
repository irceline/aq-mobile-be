import { TestBed } from '@angular/core/testing';

import { EncryptionService } from './encryption.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseX]
    });
    service = TestBed.inject(EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
