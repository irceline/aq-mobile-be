import { TestBed } from '@angular/core/testing';

import { EncryptionService } from './encryption.service';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Firebase]
    });
    service = TestBed.inject(EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
