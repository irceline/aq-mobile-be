import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationMock } from '../../testing/geolocation.mock';
import { LocationInputComponent } from './location-input.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { TranslateService } from '@ngx-translate/core';

import {By} from '@angular/platform-browser';

describe('LocationInputComponent', () => {
  let component: LocationInputComponent;
  let fixture: ComponentFixture<LocationInputComponent>;
  // const inputComponent = jasmine.createSpyObj('IonInput', ['setFocus', 'click']);
  let translateSrvc;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationInputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: Geolocation, useClass: GeolocationMock},
        Network, SettingsService, Firebase, Diagnostic, LocationAccuracy, ModalController, AngularDelegate
      ],
      imports: [TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot()],
    })
    .compileComponents();
    translateSrvc = TestBed.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationInputComponent);
    component = fixture.componentInstance;
    // component.input = inputComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load initial list of locations', () => {
  //   expect(component.filteredItems.length).toBeGreaterThan(0);
  // });

  // it('should filter the list on input properly (success)', () => {
  //   component.searchText = 'Ant';
  //   component.filterItems();
  //   fixture.detectChanges();
  //   expect(component.filteredItems.length).toEqual(10);
  //   component.filteredItems.forEach(item => {
  //     expect(item.label.toLowerCase()).toContain(component.searchText.toLowerCase());
  //   });
  //   // expect(component.filteredItems[0].label).toEqual('Antwerpen');
  //   component.searchText = 'Antw';
  //   component.filterItems();
  //   fixture.detectChanges();
  //   expect(component.filteredItems.length).toEqual(1);
  //   expect(component.filteredItems[0].label).toEqual('Antwerpen');
  // });

  // it('should filter the list on input properly (fail)', () => {
  //   component.searchText = 'DUMMY';
  //   component.filterItems();
  //   fixture.detectChanges();
  //   expect(component.filteredItems.length).toEqual(0);
  // });

  // it('should set location label, emit event and set focus', () => {
  //   spyOn(component.locationSelected, 'next');
  //   component.searchText = 'Antw';
  //   component.filterItems();
  //   fixture.detectChanges();
  //   component.chooseOption(component.filteredItems[0]);
  //   expect(component.selectedItem).toBeDefined();
  //   expect(component.selectedItem.label).toEqual('Antwerpen');
  //   expect(component.searchText).toEqual('Antwerpen');
  //   expect(component.input.setFocus).toHaveBeenCalled();

  //   expect(component.locationSelected.next).toHaveBeenCalled();
  //   expect(component.locationSelected.next).toHaveBeenCalledWith(component.selectedItem);
  // });

  // it('should show dropdown on click', () => {
  //   const element = fixture.nativeElement;
  //   const debugElement = fixture.debugElement;
  //   const dropdownBefore = element.querySelector('.location--dropdown');
  //   expect(dropdownBefore).toBeNull();

  //   component.openDropdown();
  //   fixture.detectChanges();
  //   const dropdownAfter = debugElement.query(By.css('.location--dropdown'));
  //   expect(dropdownAfter).toBeDefined();

  //   const items = dropdownAfter.queryAll(By.css('ion-row'));
  //   expect(items.length).toEqual(10);
  // });

  // it('should get current location and emit proper data', () => {
  //   spyOn(component.locationSelected, 'emit');
  //   component.getCurrentLocation().then(() => {
  //     expect(component.locationSelected.emit).toHaveBeenCalled();
  //     expect(component.locationSelected.emit).toHaveBeenCalledWith({
  //       id: 111,
  //       label: 'TODO: reverse geocoding',
  //       type: 'user',
  //       latitude: 1,
  //       longitude: 1,
  //     });
  //   });
  // });
});
