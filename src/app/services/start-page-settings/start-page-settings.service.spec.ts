import { TestBed } from '@angular/core/testing';

import { StartPageSettingsService } from './start-page-settings.service';

describe('StartPageSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StartPageSettingsService = TestBed.get(StartPageSettingsService);
    expect(service).toBeTruthy();
  });
});
