import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedGeometryMaViewerPage } from './extended-geometry-ma-viewer.page';

describe('ExtendedGeometryMaViewerPage', () => {
  let component: ExtendedGeometryMaViewerPage;
  let fixture: ComponentFixture<ExtendedGeometryMaViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedGeometryMaViewerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedGeometryMaViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
