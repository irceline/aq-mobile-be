import { TestBed } from '@angular/core/testing';

import { UserLocationTopicGeneratorService } from './user-location-topic-generator.service';

describe('UserLocationTopicGeneratorService', () => {
  let service: UserLocationTopicGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLocationTopicGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
