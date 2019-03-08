import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualMeanPanelEntryPage } from './annual-mean-panel-entry.page';

describe('AnnualMeanPanelEntryPage', () => {
  let component: AnnualMeanPanelEntryPage;
  let fixture: ComponentFixture<AnnualMeanPanelEntryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualMeanPanelEntryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualMeanPanelEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
