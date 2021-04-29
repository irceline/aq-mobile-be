import { TestBed } from '@angular/core/testing';

import { OnboardingScreenGuard } from './onboarding-screen.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

describe('OnboardingScreenGuard', () => {
  let guard: OnboardingScreenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, CacheModule.forRoot(), TranslateTestingModule],
      providers: [FirebaseX, Network, SettingsService]
    });
    guard = TestBed.inject(OnboardingScreenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
