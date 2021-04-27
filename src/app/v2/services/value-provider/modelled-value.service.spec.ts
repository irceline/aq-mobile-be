import { TestBed } from '@angular/core/testing';

import { ModelledValueService } from './modelled-value.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';

describe('ModelledValueService', () => {
  let service: ModelledValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
      providers: [SettingsService]
    });
    service = TestBed.inject(ModelledValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
