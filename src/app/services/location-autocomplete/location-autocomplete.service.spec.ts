import { TestBed } from '@angular/core/testing';

import { LocationAutocompleteService } from './location-autocomplete.service';

describe('LocationAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationAutocompleteService = TestBed.get(LocationAutocompleteService);
    expect(service).toBeTruthy();
  });
});
