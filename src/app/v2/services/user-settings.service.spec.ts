import { TestBed } from '@angular/core/testing';
import { localStorageMock } from '../testing/localStorage.mock';
import { UserSettingsService } from './user-settings.service';

describe('UserLocationsService', () => {
  let service: UserSettingsService;
  beforeEach(() => {
    spyOn(localStorage, 'getItem')
        .and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem')
        .and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem')
        .and.callFake(localStorageMock.removeItem);
    spyOn(localStorage, 'clear')
        .and.callFake(localStorageMock.clear);
    TestBed.configureTestingModule({});
    service = TestBed.get(UserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read initial localStorage', () => {
    const userLocations = localStorageMock.getItem('belAir.userLocations');
    const userSettings = localStorageMock.getItem('belAir.userNotificationSettings');
    expect(service.getUserSavedLocations()).toEqual(JSON.parse(userLocations));
    expect(service.getUserNotificationSettings()).toEqual(JSON.parse(userSettings));
  });
});
