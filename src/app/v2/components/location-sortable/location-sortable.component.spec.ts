import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSortableComponent } from './location-sortable.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import { localStorageMock } from '../../testing/localStorage.mock';
import {UserLocation} from '../../Interfaces';
import {AlertController, IonItem, IonLabel, IonReorderGroup} from '@ionic/angular';
import {By} from '@angular/platform-browser';

describe('LocationSortableComponent', () => {
  let component: LocationSortableComponent;
  let fixture: ComponentFixture<LocationSortableComponent>;
  let locations: UserLocation[];
  const alertSpy = jasmine.createSpyObj('AlertController', ['create', 'present']);
  const alertElementSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          LocationSortableComponent,
          IonReorderGroup,
          IonItem,
          IonLabel,
      ],
      providers: [
        {provide: AlertController, useValue: alertSpy}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateTestingModule, IonicModule]
    })
    .compileComponents();
    locations = JSON.parse(localStorageMock.getItem('belAir.userLocations'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSortableComponent);
    component = fixture.componentInstance;
    component.locations = locations;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show initial locations', () => {
    const de = fixture.debugElement;
    const locationLabels = de.queryAll(By.css('ion-label'));
    locationLabels.map((label, index) => {
      expect(label.nativeElement.innerHTML).toContain(locations[index].label);
    });
  });

  it('should create alert on delete location click', () => {
    const de = fixture.debugElement;
    alertElementSpy.present.and.callFake(() => Promise.resolve());
    alertSpy.create.and.callFake(() => alertElementSpy);
    fixture.detectChanges();
    component.deleteLocation(locations[0]).then(() => {
      expect(alertSpy.create).toHaveBeenCalled();
      expect(alertElementSpy.present).toHaveBeenCalled();
    });
  });

  it('should emit new order of locations on reorder', () => {
    const reorderEventDetail = {
      detail: {
        from: 3,
        to: 1,
        complete: () => jasmine.createSpy()
      }
    };
    spyOn(component.locationUpdated, 'emit');
    component.doReorder(reorderEventDetail);
    expect(component.locationUpdated.emit).toHaveBeenCalled();
  });
});
