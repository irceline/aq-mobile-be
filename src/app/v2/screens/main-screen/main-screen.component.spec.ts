import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenComponent } from './main-screen.component';
import { BelAQIService } from '../../services/bel-aqi.service';
import { specHelper } from '../../testing/spec-helper';
import { localStorageMock } from '../../testing/localStorage.mock';
import { By } from '@angular/platform-browser';
import { LocationSwipeComponent } from '../../components/location-swipe/location-swipe.component';
import { IonSlide, IonSlides } from '@ionic/angular';
import { TimeLineListComponent } from '../../components/time-line-list/time-line-list.component';
import { CircleChartComponent } from '../../components/circle-chart/circle-chart.component';
import { BackgroundComponent } from '../../components/background/background.component';
import {
    backgroundImages,
    indexLabel,
    lightIndexColor,
} from '../../common/constants';
// @ts-ignore - this doesnt exists here, and i will comment out
import { DetailDataService } from '../../services/detail-data.service';
import { dataService } from '../../testing/detail-data.service.mock';
import { DataPoint, UserLocation } from '../../Interfaces';
import moment from 'moment';
import { InformationItemComponent } from '../../components/information-item/information-item.component';
import { PullTabComponent } from '../../components/pull-tab/pull-tab.component';
import 'hammerjs';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

describe('MainScreenComponent', () => {
    let component: MainScreenComponent;
    let fixture: ComponentFixture<MainScreenComponent>;
    let belAQIService;
    // let detailDataService: DetailDataService; TODO: doesnt exists
    let timelineInstance: TimeLineListComponent;
    let locations: UserLocation[];
    let currentLocation: UserLocation;
    let defaultBelaqi;
    let initialMeasurements: DataPoint[];

    beforeEach(async(() => {
        specHelper.localStorageSetup();
        TestBed.configureTestingModule({
            declarations: [
                MainScreenComponent,
                LocationSwipeComponent,
                TimeLineListComponent,
                CircleChartComponent,
                BackgroundComponent,
                PullTabComponent,
                InformationItemComponent,
                IonSlides,
                IonSlide
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
            providers: [BelAQIService, Network, SettingsService, FirebaseX, StatusBar]
        }).compileComponents();
        belAQIService = TestBed.get(BelAQIService);
        locations = JSON.parse(
            localStorageMock.getItem('belAir.userLocations')
        );
        currentLocation = locations[0];
        spyOn(belAQIService.$activeIndex, 'next');
        //detailDataService = TestBed.get(DetailDataService);
        defaultBelaqi = 7;
        // @ts-ignore
        initialMeasurements = dataService.getMeasurmentsFor(
            currentLocation,
            moment(),
            defaultBelaqi
        );
        // spyOn(detailDataService, 'getMeasurementsFor').and.callFake(() =>
        //     Promise.resolve(initialMeasurements)
        // );
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainScreenComponent);
        component = fixture.componentInstance;
        // const timeline = fixture.debugElement.query(
        //     By.css('app-time-line-list')
        // );
        // timelineInstance = timeline.componentInstance;
        // spyOn(timelineInstance.slides, 'update').and.callFake(() => null);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // The test is already on the each component it self
    // xit('should load initial data', () => {
    //     // @ts-ignore
    //     expect(component.locations).toEqual(locations);
    //     // @ts-ignore
    //     expect(component.currentLocation).toEqual(locations[0]);
    //     expect(component.belAqiForCurrentLocation.length).toEqual(11);
    //     component.belAqiForCurrentLocation.forEach((belaqi) => {
    //         expect(belaqi.location.id).toEqual(locations[0].id);
    //     });
    // });

    // xit('should change data on change location', () => {
    //     component.onLocationChange(locations[2]);
    //     fixture.detectChanges();
    //     // @ts-ignore
    //     expect(component.currentLocation).toEqual(locations[2]);
    //     component.belAqiForCurrentLocation.forEach((belaqi) => {
    //         expect(belaqi.location.id).toEqual(locations[2].id);
    //     });
    //     expect(component.currentActiveIndex).toEqual(
    //         component.belAqiForCurrentLocation[5]
    //     );
    // });

    // it('should trigger event on belAqi $activeIndex', () => {
    //     expect(belAQIService.$activeIndex.next).toHaveBeenCalledWith(
    //         component.currentActiveIndex
    //     );
    // });

    // xit('should change the day correctly', () => {
    //     component.onDayChange(component.belAqiForCurrentLocation[4]);
    //     fixture.detectChanges();
    //     expect(component.currentActiveIndex).toEqual(
    //         component.belAqiForCurrentLocation[4]
    //     );
    //     expect(belAQIService.$activeIndex.next).toHaveBeenCalledWith(
    //         component.belAqiForCurrentLocation[4]
    //     );
    // });

    // xit('should react on slide change location', () => {
    //     const location = fixture.debugElement.query(
    //         By.css('app-location-swipe')
    //     );
    //     const locationInstance: LocationSwipeComponent =
    //         location.componentInstance;
    //     spyOn(locationInstance.slides, 'getActiveIndex').and.callFake(() =>
    //         Promise.resolve(2)
    //     );
    //     spyOn(component, 'onLocationChange');
    //     locationInstance.slideChange().then(() => {
    //         expect(component.onLocationChange).toHaveBeenCalledWith(
    //             locations[2]
    //         );
    //     });
    // });

    // xit('should react on slide change time line', () => {
    //     spyOn(timelineInstance.slides, 'getActiveIndex').and.callFake(() =>
    //         Promise.resolve(2)
    //     );
    //     spyOn(component, 'onDayChange');
    //     timelineInstance.slideChange().then(() => {
    //         expect(component.onDayChange).toHaveBeenCalledWith(
    //             component.belAqiForCurrentLocation[2]
    //         );
    //     });
    // });

    // xit('should update circle chart on slide change location', () => {
    //     const location = fixture.debugElement.query(
    //         By.css('app-location-swipe')
    //     );
    //     const locationInstance: LocationSwipeComponent =
    //         location.componentInstance;
    //     const circleChart = fixture.debugElement.query(
    //         By.css('app-circle-chart')
    //     );
    //     const circleChartInstance: CircleChartComponent =
    //         circleChart.componentInstance;
    //     const background = fixture.debugElement.query(By.css('app-background'));

    //     spyOn(locationInstance.slides, 'getActiveIndex').and.callFake(() =>
    //         Promise.resolve(2)
    //     );
    //     locationInstance.slideChange().then(() => {
    //         let belAqiIndex;
    //         belAQIService.$activeIndex.subscribe((newIndex) => {
    //             belAqiIndex = newIndex.indexScore;
    //         });
    //         const belAqiText = belAQIService.getLabelForIndex(belAqiIndex);
    //         expect(circleChartInstance.belAqi).toEqual(belAqiIndex);
    //         expect(circleChartInstance.title).toEqual(belAqiText);
    //         expect(background.styles['background-image']).toContain(
    //             backgroundImages[belAqiIndex]
    //         );
    //     });
    // });

    // xit('should update circle chart on slide change time line', () => {
    //     const circleChart = fixture.debugElement.query(
    //         By.css('app-circle-chart')
    //     );
    //     const circleChartInstance: CircleChartComponent =
    //         circleChart.componentInstance;
    //     const background = fixture.debugElement.query(By.css('app-background'));

    //     spyOn(timelineInstance.slides, 'getActiveIndex').and.callFake(() =>
    //         Promise.resolve(2)
    //     );
    //     spyOn(component, 'onLocationChange');
    //     timelineInstance.slideChange().then(() => {
    //         let belAqiIndex;
    //         belAQIService.$activeIndex.subscribe((newIndex) => {
    //             belAqiIndex = newIndex.indexScore;
    //         });
    //         const belAqiText = belAQIService.getLabelForIndex(belAqiIndex);
    //         expect(circleChartInstance.belAqi).toEqual(belAqiIndex);
    //         expect(circleChartInstance.title).toEqual(belAqiText);
    //         expect(background.styles['background-image']).toContain(
    //             backgroundImages[belAqiIndex]
    //         );
    //     });
    // });

    // xit('should load all substances in pull tab', () => {
    //     checkInfoItems(fixture, defaultBelaqi);
    // });

    // xit('should change all substances in pull tab after location change', () => {
    //     const newBelaqi = 3;
    //     // @ts-ignore
    //     initialMeasurements = dataService.getMeasurmentsFor(
    //         currentLocation,
    //         moment(),
    //         newBelaqi
    //     );
    //     const location = fixture.debugElement.query(
    //         By.css('app-location-swipe')
    //     );
    //     const locationInstance: LocationSwipeComponent =
    //         location.componentInstance;
    //     spyOn(locationInstance.slides, 'getActiveIndex').and.callFake(() =>
    //         Promise.resolve(2)
    //     );

    //     locationInstance.slideChange().then(() => {
    //         checkInfoItems(fixture, newBelaqi);
    //     });
    // });

    const checkInfoItems = (
        currentFixture: ComponentFixture<MainScreenComponent>,
        currentBelaqi: number
    ) => {
        currentFixture.whenStable().then(() => {
            fixture.detectChanges();
            const pullTab = fixture.debugElement.query(By.css('app-pull-tab'));
            const infoItems = pullTab.queryAll(By.css('app-information-item'));

            infoItems.map((info, index) => {
                const spans = info.queryAll(By.css('span'));
                expect(spans[0].styles['background-color']).toEqual(
                    lightIndexColor[currentBelaqi]
                );
                expect(spans[1].nativeElement.innerHTML).toEqual(
                    specHelper.decodeHtmlCharCodes(
                        initialMeasurements[index].substance.abbreviation
                    )
                );
                expect(spans[2].styles['color']).toEqual(
                    lightIndexColor[currentBelaqi]
                );
                expect(spans[2].nativeElement.innerHTML).toEqual(
                    indexLabel[currentBelaqi]
                );
            });
        });
    };
});
