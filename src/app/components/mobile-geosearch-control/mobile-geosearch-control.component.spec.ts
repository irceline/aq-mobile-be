import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileGeosearchControlPage } from './mobile-geosearch-control.page';

describe('MobileGeosearchControlPage', () => {
  let component: MobileGeosearchControlPage;
  let fixture: ComponentFixture<MobileGeosearchControlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileGeosearchControlPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileGeosearchControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
