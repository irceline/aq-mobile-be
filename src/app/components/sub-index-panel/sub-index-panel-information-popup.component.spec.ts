import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIndexPanelInformationPopupPage } from './sub-index-panel-information-popup.page';

describe('SubIndexPanelInformationPopupPage', () => {
  let component: SubIndexPanelInformationPopupPage;
  let fixture: ComponentFixture<SubIndexPanelInformationPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubIndexPanelInformationPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubIndexPanelInformationPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
