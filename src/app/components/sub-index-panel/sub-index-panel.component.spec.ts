import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIndexPanelPage } from './sub-index-panel.page';

describe('SubIndexPanelPage', () => {
  let component: SubIndexPanelPage;
  let fixture: ComponentFixture<SubIndexPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubIndexPanelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubIndexPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
