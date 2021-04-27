import { TestBed } from '@angular/core/testing';

import { NetworkAlertService } from './network-alert.service';
import { IonicModule } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

describe('NetworkAlertService', () => {
  let service: NetworkAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule],
      providers: [Network]
    });
    service = TestBed.inject(NetworkAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
