import { TestBed } from '@angular/core/testing';

import { OnboardingScreenGuard } from './onboarding-screen.guard';

describe('OnboardingScreenGuard', () => {
  let guard: OnboardingScreenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnboardingScreenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
