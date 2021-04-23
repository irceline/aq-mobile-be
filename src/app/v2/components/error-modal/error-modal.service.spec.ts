import { TestBed } from '@angular/core/testing';

import { ErrorModalService } from './error-modal.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ErrorModalService', () => {
  let service: ErrorModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ErrorModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
