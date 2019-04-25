import { TestBed } from '@angular/core/testing';

import { InfoOverlayService } from './overlay-info-drawer.service';

describe('InfoOverlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoOverlayService = TestBed.get(InfoOverlayService);
    expect(service).toBeTruthy();
  });
});
