import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualMeanPanelPage } from './annual-mean-panel.page';

describe('AnnualMeanPanelPage', () => {
  let component: AnnualMeanPanelPage;
  let fixture: ComponentFixture<AnnualMeanPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualMeanPanelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualMeanPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
