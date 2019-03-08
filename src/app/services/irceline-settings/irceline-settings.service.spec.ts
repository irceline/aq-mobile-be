import { TestBed } from '@angular/core/testing';

import { IrcelineSettingsService } from './irceline-settings.service';

describe('IrcelineSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IrcelineSettingsService = TestBed.get(IrcelineSettingsService);
    expect(service).toBeTruthy();
  });
});
