import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSortableComponent } from './location-sortable.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';

describe('LocationSortableComponent', () => {
  let component: LocationSortableComponent;
  let fixture: ComponentFixture<LocationSortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSortableComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
