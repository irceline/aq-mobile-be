import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualMeanPanelInformationPopupPage } from './annual-mean-panel-information-popup.page';

describe('AnnualMeanPanelInformationPopupPage', () => {
  let component: AnnualMeanPanelInformationPopupPage;
  let fixture: ComponentFixture<AnnualMeanPanelInformationPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualMeanPanelInformationPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualMeanPanelInformationPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
