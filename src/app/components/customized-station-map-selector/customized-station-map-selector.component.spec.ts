import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedStationMapSelectorPage } from './customized-station-map-selector.page';

describe('CustomizedStationMapSelectorPage', () => {
  let component: CustomizedStationMapSelectorPage;
  let fixture: ComponentFixture<CustomizedStationMapSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizedStationMapSelectorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizedStationMapSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
