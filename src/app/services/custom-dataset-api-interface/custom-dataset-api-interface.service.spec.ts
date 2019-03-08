import { TestBed } from '@angular/core/testing';

import { CustomDatasetApiInterfaceService } from './custom-dataset-api-interface.service';

describe('CustomDatasetApiInterfaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomDatasetApiInterfaceService = TestBed.get(CustomDatasetApiInterfaceService);
    expect(service).toBeTruthy();
  });
});
