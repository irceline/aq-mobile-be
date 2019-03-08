import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearestMeasuringStationPanelEntryPage } from './nearest-measuring-station-panel-entry.page';

describe('NearestMeasuringStationPanelEntryPage', () => {
  let component: NearestMeasuringStationPanelEntryPage;
  let fixture: ComponentFixture<NearestMeasuringStationPanelEntryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearestMeasuringStationPanelEntryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearestMeasuringStationPanelEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
