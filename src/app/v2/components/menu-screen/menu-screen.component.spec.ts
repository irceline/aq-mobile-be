import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuScreenComponent } from './menu-screen.component';
import { specHelper } from '../../testing/spec-helper';
import {UserLocation} from '../../Interfaces';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {RouterTestingModule} from '@angular/router/testing';
import {localStorageMock} from '../../testing/localStorage.mock';
import {IonItem, IonLabel, IonReorderGroup, NavController} from '@ionic/angular';
import { NavControllerMock } from '../../testing/nav-controller.mock';
import {LocationSortableComponent} from '../location-sortable/location-sortable.component';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('MenuScreenComponent', () => {
  let component: MenuScreenComponent;
  let fixture: ComponentFixture<MenuScreenComponent>;
  let initialLocations: UserLocation[];
  let navCtrl: NavController;

  beforeEach(async(() => {
    specHelper.localStorageSetup();
    TestBed.configureTestingModule({
      declarations: [
          MenuScreenComponent,
          LocationSortableComponent,
          IonReorderGroup,
          IonItem,
          IonLabel,
      ],
      providers: [
        { provide: NavController, useClass: NavControllerMock }
      ],
      imports: [
          TranslateTestingModule,
          RouterTestingModule,
          BrowserAnimationsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
    initialLocations = JSON.parse(localStorageMock.getItem('belAir.userLocations'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuScreenComponent);
    navCtrl = TestBed.get(NavController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new location', () => {
    const newLocation: UserLocation = {label: 'Antwerpen', type: 'user', id: 100};
    component.addLocation(newLocation);
    fixture.detectChanges();
    expect(component.locationList).toContain(newLocation);
  });

  it('should remove location', () => {
    component.removeLocation(component.locationList[1]);
    fixture.detectChanges();
    expect(component.locationList.length).toEqual(initialLocations.length - 1);
    expect(component.locationList).not.toContain(initialLocations[1]);
  });

  it('should trigger close event on clicking AppInfo link', () => {
    spyOn(component.menuClosed, 'emit');
    component.openAppInfo();
    expect(component.menuClosed.emit).toHaveBeenCalled();
  });

  it('should navigate to AppInfo', () => {
    spyOn(navCtrl, 'navigateForward');
    component.openAppInfo();
    expect(navCtrl.navigateForward).toHaveBeenCalledWith(['main/app-info']);
  });

  it('should trigger close event on clicking LongTermInfo link', () => {
    spyOn(component.menuClosed, 'emit');
    component.openLongTermInfo();
    expect(component.menuClosed.emit).toHaveBeenCalled();
  });

  it('should navigate to LongTermInfo', () => {
    spyOn(navCtrl, 'navigateForward');
    component.openLongTermInfo();
    expect(navCtrl.navigateForward).toHaveBeenCalledWith(['main/longterm-info']);
  });

  it('should update locations on locations reorder', () => {
    spyOn(component, 'updateLocation');
    component.menuVisible = true;
    fixture.detectChanges();
    const de = fixture.debugElement;
    const locationSortable: LocationSortableComponent = de.query(By.css('app-location-sortable')).componentInstance;
    const newLocations = initialLocations.reverse();
    locationSortable.locationUpdated.emit(newLocations);
    fixture.detectChanges();
    expect(component.updateLocation).toHaveBeenCalledWith(newLocations);
  });
});
