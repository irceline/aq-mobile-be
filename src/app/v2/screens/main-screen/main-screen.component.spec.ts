import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenComponent } from './main-screen.component';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { BelAQIService } from '../../services/bel-aqi.service';
import { specHelper } from '../../testing/spec-helper';
import { localStorageMock } from '../../testing/localStorage.mock';

describe('MainScreenComponent', () => {
    let component: MainScreenComponent;
    let fixture: ComponentFixture<MainScreenComponent>;
    let belAQIService;

    const initialLocations = JSON.parse(localStorageMock.getItem('belAir.userLocations'));

    beforeEach(async(() => {
        specHelper.localStorageSetup();
        TestBed.configureTestingModule({
            declarations: [MainScreenComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [TranslateTestingModule],
        }).compileComponents();
        belAQIService = TestBed.get(BelAQIService);
        spyOn(belAQIService.$activeIndex, 'next');
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // TODO: antonio or monika, commmented this because there is an error and i cant push
    it('should load initial data', () => {
        expect(component.locations).toEqual(initialLocations);
        expect(component.currentLocation).toEqual(initialLocations[0]);
        expect(component.belAqiForCurrentLocation.length).toEqual(11);
        component.belAqiForCurrentLocation.forEach((belaqi) => {
            expect(belaqi.location.id).toEqual(initialLocations[0].id);
        });
    });

    it('should change data on change location', () => {
        component.onLocationChange(initialLocations[2]);
        fixture.detectChanges();
        expect(component.currentLocation).toEqual(initialLocations[2]);
        component.belAqiForCurrentLocation.forEach((belaqi) => {
            expect(belaqi.location.id).toEqual(initialLocations[2].id);
        });
        expect(component.currentActiveIndex).toEqual(
            component.belAqiForCurrentLocation[5]
        );
    });

    it('should trigger event on belAqi $activeIndex', () => {
      expect(belAQIService.$activeIndex.next).toHaveBeenCalledWith(component.currentActiveIndex);
    });
});
