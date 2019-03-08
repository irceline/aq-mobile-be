import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearestMeasuringStationPanelPage } from './nearest-measuring-station-panel.page';

describe('NearestMeasuringStationPanelPage', () => {
  let component: NearestMeasuringStationPanelPage;
  let fixture: ComponentFixture<NearestMeasuringStationPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearestMeasuringStationPanelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearestMeasuringStationPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
