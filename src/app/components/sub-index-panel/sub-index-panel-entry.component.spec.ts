import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIndexPanelEntryPage } from './sub-index-panel-entry.page';

describe('SubIndexPanelEntryPage', () => {
  let component: SubIndexPanelEntryPage;
  let fixture: ComponentFixture<SubIndexPanelEntryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubIndexPanelEntryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubIndexPanelEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
