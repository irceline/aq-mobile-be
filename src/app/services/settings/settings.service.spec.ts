import { TestBed } from '@angular/core/testing';

import { JSSONSettingsService } from './settings.service';

describe('SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JSSONSettingsService = TestBed.get(JSSONSettingsService);
    expect(service).toBeTruthy();
  });
});
