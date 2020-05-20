import { TestBed } from '@angular/core/testing';

import { DetailDataService } from './detail-data.service';

xdescribe('DetailDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetailDataService = TestBed.get(DetailDataService);
    expect(service).toBeTruthy();
  });
});
