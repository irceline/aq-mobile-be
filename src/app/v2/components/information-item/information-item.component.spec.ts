import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import { By } from '@angular/platform-browser';
import { IonItem } from '@ionic/angular';
import moment from 'moment';

import { indexLabel, lightIndexColor } from '../../common/constants';
import { DataPoint, UserLocation } from '../../Interfaces';
import { dataService } from '../../testing/detail-data.service.mock';
import { localStorageMock } from '../../testing/localStorage.mock';
import { specHelper } from '../../testing/spec-helper';
import { InformationItemComponent } from './information-item.component';

describe('InformationItemComponent', () => {
    let component: InformationItemComponent;
    let fixture: ComponentFixture<InformationItemComponent>;
    let initialMeasurements: DataPoint[];
    let locations: UserLocation[];
    let currentLocation: UserLocation;
    let belaqi: number;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InformationItemComponent, IonItem],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [TranslateTestingModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationItemComponent);
        component = fixture.componentInstance;
        locations = JSON.parse(
            localStorageMock.getItem('belAir.userLocations')
        );
        currentLocation = locations[0];
        belaqi = 5;
        // @ts-ignore
        initialMeasurements = dataService.getMeasurmentsFor(
            currentLocation,
            moment(),
            belaqi
        );
        component.detailedDataPoint = initialMeasurements[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display proper labels and colors', () => {
        const de = fixture.debugElement;
        const spans = de.queryAll(By.css('span'));
        expect(spans[0].styles['background-color']).toEqual(
            lightIndexColor[belaqi]
        );
        expect(spans[1].nativeElement.innerHTML).toEqual(
            specHelper.decodeHtmlCharCodes(
                initialMeasurements[0].substance.abbreviation
            )
        );
        expect(spans[2].styles['color']).toEqual(lightIndexColor[belaqi]);
        expect(spans[2].nativeElement.innerHTML).toEqual(indexLabel[belaqi]);
    });

    it('should change labels and colors', () => {
        const newBelaqi = 7;
        const newMeasurements = dataService.getMeasurmentsFor(
            currentLocation,
            moment(),
            newBelaqi
        );
        // @ts-ignore
        component.detailedDataPoint = newMeasurements[2];
        fixture.detectChanges();
        const de = fixture.debugElement;
        const spans = de.queryAll(By.css('span'));
        expect(spans[0].styles['background-color']).toEqual(
            lightIndexColor[newBelaqi]
        );
        expect(spans[1].nativeElement.innerHTML).toEqual(
            specHelper.decodeHtmlCharCodes(
                newMeasurements[2].substance.abbreviation
            )
        );
        expect(spans[2].styles['color']).toEqual(lightIndexColor[newBelaqi]);
        expect(spans[2].nativeElement.innerHTML).toEqual(indexLabel[newBelaqi]);
    });
});
