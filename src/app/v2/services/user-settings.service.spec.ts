import { TestBed } from '@angular/core/testing';
import { localStorageMock } from '../testing/localStorage.mock';
import { UserSettingsService } from './user-settings.service';
import { specHelper } from '../testing/spec-helper';
import {UserLocation} from '../Interfaces';

describe('UserLocationsService', () => {
  let service: UserSettingsService;
  beforeEach(() => {
    specHelper.localStorageSetup();
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
    // expect(service.getUserNotificationSettings()).toEqual(JSON.parse(userSettings));
  });

  it('should add new location', () => {
    const newLocation: UserLocation = {label: 'Antwerpen', type: 'user', id: 100};
    service.addUserLocation(newLocation);
    expect(service.getUserSavedLocations()).toContain(newLocation);
  });

  it('should remove a location', () => {
    const userLocations: UserLocation[] = JSON.parse(localStorageMock.getItem('belAir.userLocations'));
    const savedLocationsBefore = service.getUserSavedLocations();
    service.removeUserLocation(userLocations[2]);
    expect(service.getUserSavedLocations().length).toEqual(savedLocationsBefore.length - 1);
    const savedLocationsAfter = savedLocationsBefore.filter(x => x.id !== userLocations[2].id);
    expect(service.getUserSavedLocations()).toEqual(savedLocationsAfter);
  });
});
