import { TestBed } from '@angular/core/testing';

import { LanguageHandlerService } from './language-handler.service';

describe('LanguageHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanguageHandlerService = TestBed.get(LanguageHandlerService);
    expect(service).toBeTruthy();
  });
});
