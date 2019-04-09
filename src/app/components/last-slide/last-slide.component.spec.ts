import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSlideComponent } from './last-slide.component';

describe('LastSlideComponent', () => {
  let component: LastSlideComponent;
  let fixture: ComponentFixture<LastSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LastSlideComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
