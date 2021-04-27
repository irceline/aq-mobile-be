import { TestBed } from '@angular/core/testing';

import { PouchDBInitializerService } from './pouch-db-initializer.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';

describe('PouchDBInitializerService', () => {
  let service: PouchDBInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CacheModule.forRoot()],
      providers: [Network]
    });
    service = TestBed.inject(PouchDBInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
