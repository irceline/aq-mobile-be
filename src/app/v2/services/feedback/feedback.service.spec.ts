import { TestBed } from '@angular/core/testing';

import { FeedbackService } from './feedback.service';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from '@helgoland/core';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), HttpClientTestingModule],
      providers: [HttpService, Firebase]
    });
    service = TestBed.inject(FeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
