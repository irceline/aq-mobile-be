import { TestBed } from '@angular/core/testing';

import { PouchDBInitializerService } from './pouch-db-initializer.service';

describe('PouchDBInitializerService', () => {
  let service: PouchDBInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PouchDBInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
