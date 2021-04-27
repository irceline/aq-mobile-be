import { TestBed } from '@angular/core/testing';

import { LocateService } from './locate.service';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

describe('LocateService', () => {
  let service: LocateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule],
      providers: [Geolocation, Diagnostic, LocationAccuracy]
    });
    service = TestBed.inject(LocateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
