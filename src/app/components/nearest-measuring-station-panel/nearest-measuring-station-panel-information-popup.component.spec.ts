import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearestMeasuringStationPanelInformationPopupPage } from './nearest-measuring-station-panel-information-popup.page';

describe('NearestMeasuringStationPanelInformationPopupPage', () => {
  let component: NearestMeasuringStationPanelInformationPopupPage;
  let fixture: ComponentFixture<NearestMeasuringStationPanelInformationPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearestMeasuringStationPanelInformationPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearestMeasuringStationPanelInformationPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
